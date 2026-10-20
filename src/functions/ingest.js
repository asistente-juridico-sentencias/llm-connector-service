const { app } = require('@azure/functions');

app.http('ingest', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return { status: 200, body: "service running!"}
    }
});
