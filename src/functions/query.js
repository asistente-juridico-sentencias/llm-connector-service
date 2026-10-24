const { app } = require('@azure/functions');
const { Response } = require('../common/response.js');
const { STATUS_CODES } = require('../common/constants.js');
const { VectorDbService } = require('../services/vectorDb.js');
const logger = require('../config/logger.js');
app.http('query', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try{
            logger.log('info', 'Received request to query vector store');

            const requestPayload = await request.json();
            const vectorStoreId = requestPayload.vectorStoreId;
            const query = requestPayload.query;

            logger.log(
                'info', 
                `Querying vector store with ID: 
                ${vectorStoreId} and query:
                 ${query}`
            );

            const searchResponse = await VectorDbService
            .searchInVectorStore(vectorStoreId, query);

            logger.log(
                'info', 
                `Search completed successfully with response:
                 ${JSON.stringify(searchResponse)}`
                );
            const response = new Response(
                STATUS_CODES.OK, 
                '', 
                searchResponse
            );
            return { status: response.status, jsonBody: response };

        } catch (error) {
            logger.log(
                'error', 
                `Error occurred while processing the query request: 
                ${error.message}`
            );
            const response = new Response(
                STATUS_CODES.INTERNAL_SERVER_ERROR, 
                error.message
            );
            return { status: response.status, jsonBody: response };
        }
    }
});
