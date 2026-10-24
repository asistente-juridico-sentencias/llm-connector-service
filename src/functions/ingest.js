const { app } = require('@azure/functions');
const { Response } = require('../common/response.js');
const { STATUS_CODES } = require('../common/constants.js');
const { VectorDbService } = require('../services/vectorDb.js');
const logger = require('../config/logger.js');
app.http('ingest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            logger.log('info', 'Received request to upload file and create vector store');
            const requestPayload = await request.formData();
            const file = requestPayload.get('file');
            if (!file || typeof file === 'string') {
                const badRequest = new Response(
                    STATUS_CODES.BAD_REQUEST,
                    "Missing 'file' field in multipart form data"
                );
                return { status: badRequest.status, jsonBody: badRequest };
            }
            const fileId = await VectorDbService
                                 .saveFileIntoVectorDb(file);
            logger.log('info', `File saved into vector database with ID: ${fileId}`);
            const vectorStoreResponse = await VectorDbService
              .createVectorStoreFromFile(
                fileId, 
                requestPayload.get('name') || file.name,
            );
            logger.log('info', `Vector store created successfully with response: ${JSON.stringify(vectorStoreResponse)}`);
            const response = new Response(
                STATUS_CODES.OK, 
                '', 
                vectorStoreResponse
            );
            return { status: response.status, jsonBody: response };
        } catch (error) {
            logger.log('error', `Error occurred while processing the request: ${error.message}`);
            const response = new Response(
                STATUS_CODES.INTERNAL_SERVER_ERROR, 
                error.message
            );
            return { status: response.status, jsonBody: response };
        }
    }
});
