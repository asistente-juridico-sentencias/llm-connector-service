const { toFile } = require('openai');
const {openAIClient} = require('../config/client');
const logger = require('../config/logger.js');
class VectorDbService {
    static async saveFileIntoVectorDb(uploadedFile) {
        try{
            logger.log(
                'info', 
                'Saving file into vector database'
            );
            const file = await openAIClient.files.create({
                file: await toFile(
                    Buffer.from(await uploadedFile.arrayBuffer()),
                    uploadedFile.name
                ),
                purpose: 'assistants'
            });
            logger.log(
                'info', 
                `File saved into vector database with ID: 
                ${file.id}`
            );
            return file.id;
        } catch (error) {
            logger.log(
                'error', 
                `Error occurred while saving file into vector database:
                 ${error.message}`
            );
            throw error;
        }
    }

    static async createVectorStoreFromFile(fileId, name) {
        try{
            logger.log(
                'info', 
                `Creating vector store from file with ID: 
                ${fileId} 
                and name:
                 ${name}`
            );

            const response = await openAIClient.vectorStores.create({
                file_ids: [fileId],
                name: name,
            });

            return response;
        } catch (error) {
            logger.log(
                'error', 
                `Error occurred while creating vector store from file: ${error.message}`
            );
            throw error;
        }
    }

    static async searchInVectorStore(vectorStoreId, query) {
        try{
            logger.log(
                'info', 
                `Searching in vector store with ID: 
                ${vectorStoreId} 
                and query:
                 ${query}`
            );
            const response = await openAIClient.vectorStores.search(vectorStoreId, {
                query: query,
            });
            logger.log(
                'info', 
                `Search completed successfully with response:
                 ${JSON.stringify(response)}`
            );
            return response;
        } catch (error) {
            logger.log(
                'error', 
                `Error occurred while searching in vector store: ${error.message}`
            );
            throw error;
        }
    }

}

module.exports = { VectorDbService };