const { OpenAI } = require('openai');
const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || undefined,
});

module.exports = {openAIClient };
