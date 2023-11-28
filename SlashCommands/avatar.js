const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Usuario cuyo avatar quieres mostrar')
        ),

    async execute(interaction) {
        const { user, client, guild } = interaction;
        const imageProperties = { size: 1024, dynamic: true };

        // Obtener el objetivo del comando
        const target = interaction.options.getUser('user') || user;

        // Obtener información del miembro
        const member = await guild.members.fetch(target.id);
        const avatar =
            member?.user.avatarURL(imageProperties) || target.avatarURL(imageProperties);


        if (!avatar) return interaction.reply('Este usuario no tiene avatar.');

        // Crear MessageEmbed
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Pedido por ${user.username}`,
                iconURL: user.avatarURL(),
            })
            .setTitle(`Avatar de ${target.tag}`)
            .setColor('Aqua')
            .setImage(avatar)
            .setFooter({
                text: client.user.username,
                iconURL: client.user.avatarURL(),
            });

        // Respuesta
        await interaction.reply({
            embeds: [embed],
        });
    },
};
