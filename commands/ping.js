const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("gcommands")
const Discord = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

module.exports = {
  name: "ping",
  description: "Check bot ping",
  run: async ({ client, message, interaction }, args) => {
    if (typeof (message) !== 'undefined') {
      message.channel.send('Loading data').then(async (msg) => {
        msg.delete()
        message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
      })
    }
    if (typeof (interaction) !== 'undefined') {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: `🏓 API Latency is ${Math.round(client.ws.ping)}ms`
          }
        }
      })
    }
    else {
      return
    }
  }
};