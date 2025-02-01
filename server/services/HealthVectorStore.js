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
            console.log('Storing health data for user:', userId);
            console.log('Health data:', healthData);
            
            // 转换健康数据为文本
            const healthText = JSON.stringify(healthData);
            
            // 存储到 ChromaDB
            await this.collection.add({
                ids: [Date.now().toString()],
                documents: [healthText],
                metadatas: [{ userId: userId }]
            });
            
            console.log('Successfully stored health data in vector database');
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

    // Format health data as text
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

    // Get all health records
    async getAllHealthRecords() {
        try {
            const result = await this.collection.get();
            return {
                ids: result.ids,
                documents: result.documents,
                metadatas: result.metadatas
            };
        } catch (error) {
            console.error('Error getting health records:', error);
            throw error;
        }
    }

    // Get health records for a specific user
    async getUserHealthRecords(userId) {
        try {
            const result = await this.collection.get({
                where: { userId: userId }
            });
            return {
                ids: result.ids,
                documents: result.documents,
                metadatas: result.metadatas
            };
        } catch (error) {
            console.error('Error getting user health records:', error);
            throw error;
        }
    }

    // Get database statistics
    async getDBStats() {
        try {
            const count = await this.collection.count();
            return {
                totalRecords: count,
                collectionName: this.DB_NAME
            };
        } catch (error) {
            console.error('Error getting DB stats:', error);
            throw error;
        }
    }

    // 获取特定用户的向量记录
    async getUserRecords(userId) {
        try {
            console.log('Fetching records for user:', userId);
            const result = await this.collection.get({
                where: { "userId": userId }
            });
            console.log('Found records:', result);
            
            // 格式化返回数据，使其更易读
            const records = result.ids.map((id, index) => {
                return {
                    id: id,
                    originalText: result.documents[index],
                    metadata: result.metadatas[index],
                    embedding: result.embeddings[index]  // 向量数据
                };
            });

            return {
                userId: userId,
                recordCount: records.length,
                records: records
            };
        } catch (error) {
            console.error('Error getting user records:', error);
            throw error;
        }
    }
}

export default new HealthVectorStore();
