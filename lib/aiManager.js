const AtriaClient = require('./atriaClient');
const config = require('../config');
const logger = require('./logger');

const client = new AtriaClient(config.ai.apiKey);

/**
 * Generate response AI dengan mempertimbangkan history percakapan
 * @param {string} userInput - Pesan dari user
 * @param {Array} history - History percakapan sebelumnya
 * @returns {Promise<{text: string, error: boolean}>}
 */
async function generateResponse(userInput, history = []) {
    try {
        // Format input dengan history + system prompt
        const messages = [
            { role: "system", content: config.ai.systemPrompt },
            ...history,
            { role: "user", content: userInput }
        ];

        const response = await client.createResponse(messages, {
            model: config.ai.model
        });

        const text = client.extractText(response);

        if (!text) {
            throw new Error("Response AI kosong");
        }

        return { text, error: false };
    } catch (e) {
        logger.error(`AI Error: ${e.message}`);
        return {
            text: "❌ Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi nanti.",
            error: true
        };
    }
}

/**
 * Update history percakapan user, batasi sesuai maxHistoryLength
 * @param {Array} history - History lama
 * @param {string} userInput - Pesan user
 * @param {string} aiResponse - Response AI
 * @returns {Array} History yang sudah diupdate
 */
function updateHistory(history, userInput, aiResponse) {
    const newHistory = [
        ...history,
        { role: "user", content: userInput },
        { role: "assistant", content: aiResponse }
    ];

    // Batasi panjang history (ambil yang terbaru saja)
    const maxLength = config.ai.maxHistoryLength * 2; // *2 karena user+assistant
    if (newHistory.length > maxLength) {
        return newHistory.slice(newHistory.length - maxLength);
    }

    return newHistory;
}

module.exports = { generateResponse, updateHistory };