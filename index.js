//Dependencias
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");

//Cliente de discord
const Client = new Discord.Client({
    intents : 3243773,
});

//Cargar comandos
Client.commands = new Discord.Collection();

fs.readdirSync("./SlashCommands").forEach((commandfile) => {
    const command = require(`./SlashCommands/${commandfile}`);
    Client.commands.set(command.data.name.toLowerCase(), command);
});

//Registrar comandos
const REST = new Discord.REST().setToken(config.CLIENT_TOKEN);

(async  () => {
    try {
        await REST.put(
            Discord.Routes.applicationGuildCommands(config.clientId, config.guildId),
            {
                body: Client.commands.map((cmd) => cmd.data.toJSON()),
            }
        );
        console.log(`Loaded ${Client.commands.size} slash commands {/}`);
    } catch (error){
        console.log("Error loading commands.", error);
    }
})();

//Contenido (eventos)
    //Evento ready: se ejecuta cuando el bot esta listo
Client.on("ready", async (client) => {
    console.log('Bot Online!');
});
    //Evento interactionCreate: se ejecuta cuando un usuario utiliza un comando
Client.on("interactionCreate", async (interaction) => {
    //Si la interaccion es un slash commands
    if(interaction.isChatInputCommand()){
        //Obtiene los datos del comando
        const command = Client.commands.get(interaction.commandName)
        //Ejecuta el comando
        command.execute(interaction).catch(console.error);
    } else{
        //Si la interaccion no es un slash command(botones, menus, etc...)
    }
})

//Conexión
Client.login("MTE3ODgwNTYyMzk5MTgyODUwMA.GGkC9W.5SiUX5wBkAODLm7LprRv7VVU3sH_O-2URwRS14");
