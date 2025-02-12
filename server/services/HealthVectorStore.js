/* 
 * This file create and manage a vector database(Chroma). 
 * 
 * Chroma: is an open source vector database for storing, indexing, 
 * and searching vector.
 */

import { ChromaClient } from 'chromadb';
import geminiEmbedding from '../utils/GeminiEmbedding.js'; 

/**
 * Service for managing health data in vector database
 * @class
 */
class HealthVectorStore {
    /**
     * Creates an instance of HealthVectorStore
     * @constructor
     */
    constructor() {
        this.DB_NAME = "health_records_db";
        this.embedFunction = geminiEmbedding;
        this.client = new ChromaClient({
            path: "http://localhost:8000"  // Default ChromaDB server address (using HTTP connection)
        });
        this.initializeDB();
    }

    /**
     * Initializes the vector database
     * @returns {Promise<void>}
     * @throws {Error} If database initialization fails
     */
    async initializeDB() {
        try {
            // Trying to get an existing collection
            try {
                this.collection = await this.client.getCollection({
                    name: this.DB_NAME,
                    embeddingFunction: this.embedFunction
                });
                console.log('Using existing vector database collection');
            } catch (error) {
                // If the collection does not exist, a new one is created
                this.collection = await this.client.createCollection({
                    name: this.DB_NAME,
                    embeddingFunction: this.embedFunction
                });
                console.log('Created new vector database collection');
            }
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    /**
     * Stores health data in the vector database
     * @param {string} userId - The user's ID
     * @param {Object} healthData - The health data to store
     * @returns {Promise<void>}
     */
    async storeHealthData(userId, healthData) {
        try {
            console.log('=== 3. Start storing health data ===');
            
            // 1. Formatting data
            const healthText = this.formatHealthData(healthData, false);
            console.log('Formatted text:', healthText);
            
            // 2. Generating embedding
            const embedding = await this.embedFunction.generate(healthText);
            console.log('Embedding generated:', !!embedding); // Ture of False
            
            // 3. Store to the ChromaDB
            const id = Date.now().toString();
            await this.collection.add({
                ids: [id],
                documents: [healthText],
                metadatas: [{
                    userId: userId,
                    timestamp: Date.now()
                }],
                embeddings: embedding
            });
            
            // 4. Verify that the storage was successful
            const stored = await this.collection.get({
                ids: [id],
                include: ["embeddings"]
            });
            
            console.log('Storage verification:', {
                id: id,
                success: !!stored,
                hasEmbeddings: !!stored?.embeddings,
                firstThreeSamples: embedding ? embedding.slice(0, 3) : null,  // Only the first three numbers are displayed
            });
            
            if (!stored || !stored.embeddings) {
                throw new Error('Failed to verify storage');
            }
            
            return true;
        } catch (error) {
            console.error('Error in storeHealthData:', error);
            throw error;
        }
    }

    /**
     * Finds similar health profiles
     * @param {Object} healthData 
     * @param {number} limit - Maximum number of results
     * @returns {Promise<Array>} Similar health profiles
     */
    async findSimilarProfiles(healthData, limit = 3) {
        try {
            console.log('=== Finding similar profiles ===');

            this.embedFunction.documentMode = false; // Switch to query mode
            const queryText = `Goal: ${healthData.goal}`;
            
            const results = await this.collection.query({
                queryTexts: [queryText],
                nResults: limit
            });

            return {
                documents: results.documents[0],  // All similar documents(limit)
                count: results.documents[0].length,
                distances: results.distances?.[0],  // Similarity distance
            };
        } catch (error) {
            console.error('Error finding similar profiles:', error);
            throw error;
        } finally {
            this.embedFunction.documentMode = true; // Switch back to document mode
        }
    }

    // Formatting
    formatHealthData(data, includeGoal = true) {
        try {
            const baseProfile = `
                User Health Profile:
                Weight: ${data.weight}kg
                Height: ${data.height}cm
                Age: ${data.age}
                Diet Type: ${data.dietType}
                Activity Level: ${data.activityLevel}
                Fitness Experience: ${data.fitnessExperience}
                Meal Frequency: ${data.mealFrequency}
                Sleep Hours: ${data.sleepHours}
            `.trim();

            // Select whether the return contains the goal(query) as needed
            return includeGoal ? 
                `${baseProfile}\nGoal: ${data.goal}` : 
                baseProfile;
        } catch (error) {
            console.error('Error formatting health data:', error);
            throw error;
        }
    }
    // Get all vector records
    async getRecords(userId = null) {
        try {
            console.log('\n=== 2. Start getRecords ===');
            // console.log('Requested for userId:', userId);
            
            // 1. Basic connection check
            const heartbeat = await this.client.heartbeat();
            console.log('ChromaDB connected, heartbeat:', heartbeat);
            
            // 2. Get all records - do not use any conditions
            console.log('Fetching all records without conditions...');
            const result = await this.collection.get();
            console.log('Initial fetch complete');
            
            // 3. Verify the results
            if (!result || !result.ids || !result.ids.length) {
                console.log('No records found in collection');
                return {
                    totalRecords: 0,
                    records: [],
                    ...(userId && { userId })
                };
            }
            
            console.log(`Found ${result.ids.length} total records`);
            
            // 4. Build record structure
            let records = [];
            for (let i = 0; i < result.ids.length; i++) {
                records.push({
                    id: result.ids[i],
                    document: result.documents[i],
                    metadata: result.metadatas[i],
                });
            }
            
            // 5. Filter user records, if needed
            if (userId) {
                console.log('Filtering records for user:', userId);
                records = records.filter(record => 
                    record.metadata && record.metadata.userId === userId
                );
                console.log(`Found ${records.length} records for user`);
            }
            
            // 6. Return results
            const response = {
                totalRecords: records.length,
                records,
                ...(userId && { userId })
            };
            
            console.log('=== 2. getRecords completed successfully ===\n');
            return response;
            
        } catch (error) {
            console.error('Error in getRecords:', error);
            throw new Error(`Failed to get records: ${error.message}`);
        }
    }
    
    // Get vector database stats
    async getStats() {
        try {
            console.log('Getting vector database stats');
            const result = await this.collection.get();
            
            return {
                collectionName: this.DB_NAME,
                totalRecords: result.ids.length,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            throw error;
        }
    }
}

export default new HealthVectorStore();
