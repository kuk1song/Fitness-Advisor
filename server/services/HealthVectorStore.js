/* 
 * This file create and manage a vector database(Chroma). In other words, 
 * store the vectors generated in the GeminiEmbedding.js file in Chroma.
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
            // 1. Format data
            const healthText = this.formatHealthData(healthData);
            console.log('Formatted health text:', healthText);

            // 2. Store to ChromaDB (automatically call embedFunction.generate)
            const result = await this.collection.add({
                ids: [Date.now().toString()],
                documents: [healthText],
                metadatas: [{ userId: userId }]
            });

            console.log('Stored data with embeddings:', result);
            return true;
        } catch (error) {
            console.error('Error storing health data:', error);
            throw error;
        }
    }

    /**
     * Finds similar health profiles
     * @param {Object} healthData - The health data to compare
     * @param {number} limit - Maximum number of results
     * @returns {Promise<Array>} Similar health profiles
     */
    async findSimilarProfiles(healthData, limit = 3) {
        try {
            this.embedFunction.documentMode = false; // Switch to query mode
            const queryText = this.formatHealthData(healthData);
            
            const results = await this.collection.query({
                queryTexts: [queryText],
                nResults: limit
            });

            return results.documents[0]; // Return the most similar documents
        } catch (error) {
            console.error('Error finding similar profiles:', error);
            throw error;
        } finally {
            this.embedFunction.documentMode = true; // Switch back to document mode
        }
    }

    // Formatting
    formatHealthData(healthData) {
        return `
            User Health Profile:
            Weight: ${healthData.weight}kg
            Height: ${healthData.height}cm
            Age: ${healthData.age}
            Diet Type: ${healthData.dietType}
            Activity Level: ${healthData.activityLevel}
            Fitness Experience: ${healthData.fitnessExperience}
            Meal Frequency: ${healthData.mealFrequency}
            Sleep Hours: ${healthData.sleepHours}
            Goal: ${healthData.goal}
        `;
    }

    // Get all vector records
    async getRecords(userId = null) {
        try {
            console.log('\n=== Start getRecords (New Version) ===');
            console.log('Requested for userId:', userId);
            
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
                    metadata: result.metadatas[i]
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
            
            console.log('=== getRecords completed successfully ===\n');
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
