const axios = require('axios');

async function sendTelegramMessage(chatId, message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
        console.log('Telegram message sent:', response.data);
    } catch (err) {
        console.error('Failed to send Telegram message:', err.response.data);
    }
}

module.exports = { sendTelegramMessage };
