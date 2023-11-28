const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('elo')
        .setDescription('Obtiene el ELO de League of Legends de un jugador')
        .addStringOption(option =>
            option
                .setName('usuario_riot')
                .setDescription('Nombre de usuario de Riot Games')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('region_riot')
                .setDescription('Región de Riot Games')
                .setRequired(true)
        ),

    async execute(interaction) {
        const riotUsername = interaction.options.getString('usuario_riot');
        const riotRegion = interaction.options.getString('region_riot').toLowerCase();

        try {
            const riotApiKey = 'RGAPI-7da9ab36-67a3-49a3-b1f5-bbc42d36ad2a';

            const summonerInfo = await getSummonerInfo(riotUsername, riotRegion, riotApiKey);

            if (!summonerInfo) {
                throw new Error('No se pudo obtener información del invocador.');
            }

            const summonerRank = await getSummonerRank(summonerInfo.id, riotRegion, riotApiKey);

            if (summonerRank) {
                await interaction.reply(`El ELO de ${riotUsername} en la región ${riotRegion.toUpperCase()} es ${summonerRank.tier} ${summonerRank.rank}`);
            } else {
                await interaction.reply(`${riotUsername} no tiene clasificación en la región ${riotRegion.toUpperCase()}.`);
            }
        } catch (error) {
            console.error('Error al obtener información de Riot Games:', error.message);
            await interaction.reply('Ocurrió un error al obtener información de Riot Games.');
        }
    },
};

async function getSummonerInfo(username, region, apiKey) {
    const summonerApiUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(username)}`;

    const response = await axios.get(summonerApiUrl, {
        headers: {
            'X-Riot-Token': apiKey,
        },
    });

    return response.data;
}

async function getSummonerRank(summonerId, region, apiKey) {
    const rankApiUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;

    const response = await axios.get(rankApiUrl, {
        headers: {
            'X-Riot-Token': apiKey,
        },
    });

    const rankedData = response.data.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
    return rankedData || null;
}
