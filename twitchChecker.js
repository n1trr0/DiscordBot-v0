// twitchChecker.js
const axios = require("axios");

async function checkTwitchStreams(client) {
    const twitchChannels = ['n1trr0_'];
    const twitchApiKey = 'tu_clave_de_api_de_twitch';
    const targetChannelId = '1176636730149974086'; //Id del channel "directo" del server

    for (const channel of twitchChannels) {
        try {
            const twitchApiUrl = `https://api.twitch.tv/helix/streams?user_login=${channel}`;
            const response = await axios.get(twitchApiUrl, {
                headers: {
                    'Client-ID': twitchApiKey,
                },
            });

            const isLive = response.data.data.length > 0;

            if (isLive) {
                const streamInfo = response.data.data[0];
                const targetChannel = client.channels.cache.get(targetChannelId);

                if (targetChannel && targetChannel.isText()) {
                    const twitchMessage = `¡${channel} está en directo en Twitch! ¡Ven a verlo en https://twitch.tv/${channel}`;
                    targetChannel.send(twitchMessage);
                }
            }
        } catch (error) {
            console.error('Error al obtener información de Twitch:', error);
        }
    }
}

module.exports = { checkTwitchStreams };
