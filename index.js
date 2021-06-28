const { GCommands } = require("gcommands");
const Discord = require("discord.js");
require('dotenv').config();

const client = new Discord.Client();
const { MessageButton, MessageActionRow } = require("gcommands")


client.on("ready", () => {
    const GCommandsClient = new GCommands(client, {
        cmdDir: "commands/",
        eventDir: "events/",
        unkownCommandMessage: false,
        language: "english", //english, spanish, portuguese, russian, german, czech, turkish
        ownLanguageFile: require("./message.json"),
        slash: {
            slash: 'both',
            prefix: 'jb!'
        },
        defaultCooldown: 1,
    })

    GCommandsClient.on("debug", (debug) => {
        //console.log(debug)
    })

    console.log("Ready")
})


client.login(process.env.token)