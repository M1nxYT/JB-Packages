const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("gcommands")
const Discord = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

module.exports = {
	name: "test",
	description: "command ping",
	cooldown: 5,
	run: async ({ client, interaction, member, message, guild, channel, respond, edit }, args) => {
		let msg = await respond({
			content: "loading!",
			allowedMentions: { parse: [], repliedUser: true },
			inlineReply: true
		})
		console.log(interaction)
		console.log(message)
		edit({
			content: (`🏓Latency is ${msg.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`),
		})
	}
};