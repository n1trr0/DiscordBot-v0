const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

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
            const riotApiKey = 'RGAPI_key';

            const summonerInfo = await getSummonerInfo(riotUsername, riotRegion, riotApiKey);

            if (!summonerInfo) {
                throw new Error('No se pudo obtener información del invocador.');
            }

            const summonerRank = await getSummonerRank(summonerInfo.id, riotRegion, riotApiKey);
            const summonerIconUrl = getSummonerIconUrl(summonerInfo.profileIconId, riotRegion);

            //getLatestVersion(); //checks ddragon last version

            if (summonerRank) {
                // Crear MessageEmbed
                const embed = new EmbedBuilder()
                    .setTitle(`Rango de ${riotUsername.toUpperCase()}`)
                    .setColor(0xFFD500)
                    .setDescription(`${riotUsername} es ${summonerRank.tier} ${summonerRank.rank}`)
                    .setThumbnail(summonerIconUrl);
                    /*.setFooter({
                        text: client.user.username,
                        iconURL: client.user.avatarURL(),
                    });*/


                // Respuesta
                await interaction.reply({
                    embeds: [embed],
                });
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

function getSummonerIconUrl(profileIconId, region) {
    return `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/profileicon/${profileIconId}.png`;
}
async function getLatestVersion() {
    try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = response.data;

        // La primera versión en la lista es la más reciente
        const latestVersion = versions[0];

        console.log('La versión más reciente de DDragon es:', latestVersion);
        return latestVersion;
    } catch (error) {
        console.error('Error al obtener la versión de DDragon:', error.message);
        throw error;
    }
}
