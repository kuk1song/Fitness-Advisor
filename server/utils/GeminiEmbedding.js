/* 
 * This file contains a class that uses Gemini API(embedContent) to generate embeddings.
 * embedContent: is a text embedding method provided by Google Gemini API, 
 * which is used to convert text into a vector.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiEmbedding {
    /**
     * Initializes the GeminiEmbedding with Gemini API key
     * @constructor
     */
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "text-embedding-004"});
        // this.documentMode = true; // Controls the task type: "retrieval_document" or "retrieval_query"
    }

    // /**
    //  * Internal method: actually perform the embedding conversion
    //  * @param {string} input - The text to generate embeddings
    //  * @returns {Promise<number[]>} A promise that resolves to an array of embedding values
    //  * @throws {Error} If embedding generation fails
    //  */
    // async __call__(input) {
    //     try {
    //         const embeddingTask = this.documentMode ? 
    //             "retrieval_document" : // User input health info without goal
    //             "retrieval_query"; // Goal(last step) by the user input
            
    //         // Call to embedContent API
    //         const response = await this.model.embedContent({
    //             model: "models/text-embedding-004",
    //             content: input,
    //             taskType: embeddingTask
    //         });

    //         return response.embedding;
    //     } catch (error) {
    //         console.error('Embedding generation error:', error);
    //         throw error;
    //     }
    // }

    // Public method(packaging method)
    async generate(texts) {
        try {
            console.log('=== 4. Start generate embeddings(GeminiEmbedding) ===');
            // console.log('Input texts:', texts);

            if (!Array.isArray(texts)) {
                texts = [texts];
            }

            const embeddings = await Promise.all(
                texts.map(async (text) => {
                    const result = await this.model.embedContent(text);
                    return result.embedding.values;
                })
            );

            //  calling __call__
            // const embeddings = await this.__call__(texts);

            console.log('Generated embeddings length:', embeddings.length);
            return embeddings;
        } catch (error) {
            console.error('Error in GeminiEmbedding:', error);
            throw error;
        }
    }
}

export default new GeminiEmbedding();

// HealthVectorStore
// → calls generate()
// → calls __call__()
//     → calls Gemini API
//         → returns embeddings