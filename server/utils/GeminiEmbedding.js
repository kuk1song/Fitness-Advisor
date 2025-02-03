/* 
 * This file is a class that uses Gemini API(embedContent) to generate embeddings.
 * embedContent: is a text embedding method provided by Google Gemini API, 
 * which is used to convert text into a vector.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * A class that provides embedding functionality using Google's Gemini API
 * @class
 */
class GeminiEmbedding {
    /**
     * Initializes the GeminiEmbedding with Gemini API key
     * @constructor
     */
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "embedding-001" });
        this.documentMode = true; // Controls the task type: "retrieval_document" or "retrieval_query"
    }

    /**
     * Generates embeddings for the given input text
     * @param {string} input - The text to generate embeddings for
     * @returns {Promise<number[]>} A promise that resolves to an array of embedding values
     * @throws {Error} If embedding generation fails
     */
    async __call__(input) {
        try {
            const embeddingTask = this.documentMode ? 
                "retrieval_document" : 
                "retrieval_query";
            
            // Call to embedContent API
            const response = await this.model.embedContent({
                model: "models/text-embedding-004",
                content: input,
                taskType: embeddingTask
            });

            return response.embedding;
        } catch (error) {
            console.error('Embedding generation error:', error);
            throw error;
        }
    }

    // Generate embeddings for the given input text
    async generate(texts) {
        try {
    
            if (!Array.isArray(texts)) {
                texts = [texts];
            }

            // Generate embeddings for each text
            const embeddings = await Promise.all(
                texts.map(async (text) => {
                    const embedding = await this.model.embedContent(text);
                    return embedding.embedding.values;
                })
            );

            return embeddings;
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    }
}

export default new GeminiEmbedding();
