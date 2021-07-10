const { GCommands } = require("gcommands");
const Discord = require("discord.js");
require('dotenv').config();

const client = new Discord.Client();

module.exports = {
  name: "reload",
	description: "reload a command",
	cooldown: "1s",
  userOnly: "719292655963734056",
  run: async ({ client, message }, args) => {
    commandName = args.join(' ')
    try {
      delete require.cache[require.resolve(`./${commandName}.js`)]
      client.gcommands.delete(commandName)
      const file = require(`./${commandName}.js`)
      client.gcommands.set(commandName, file)
			console.log(client.gcommands.get(commandName).name)
			console.log(client.gcommands.get(commandName).alias)
			console.log(client.gcommands.get(commandName).description)
			console.log(client.gcommands.get(commandName).cooldown)
      message.channel.send(`Reloaded ${commandName}!`)
    } catch (err) {
      message.channel.send('Something went wrong!')
    }
  }
}