//Dependencias
const Discord = require("discord.js");

//Cliente de discord
const Client = new Discord.Client({
    intents : 3243773,
});

//Contenido (eventos)
Client.on("ready", async (client) => {
    console.log('Bot Online!');
});

//Conexion
Client.login("MTE3ODgwNTYyMzk5MTgyODUwMA.GGkC9W.5SiUX5wBkAODLm7LprRv7VVU3sH_O-2URwRS14");
