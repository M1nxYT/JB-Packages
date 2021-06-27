const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("gcommands")
const Discord = require('discord.js');


function truncateString(str, num) {
  try {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '..'
  } catch (err) {
    str = `No Description..`
    return str
  }
}

module.exports = {
  name: "search",
  description: "Search for a package",
  run: async ({ client, message }, args) => {
    let btn1 = new MessageButton().setEmoji('<:prev:855836521110044684>').setStyle('grey').setID('prev');
    let btn2 = new MessageButton().setEmoji('<:next:855836521402990592>').setStyle('grey').setID('next');
    let row = new MessageActionRow().addComponent(btn1).addComponent(btn2);
    packageName = args.join(" ").replace(new RegExp("@", "g"), '')
    if (packageName.length == 0) { message.channel.send("Specify a package name"); return }


    body = await fetch(`https://api.parcility.co/db/search?q=${packageName}`).then(res => res.json())

    if (!body.status) {
      message.reply("Nothing found with given params or parcility couldn't be reached.");
      return
    } else {

      package = body.data[0];

      result = {
        title: package.Name,
        description: truncateString(package.Description, 100),
        url: `https://parcility.co/package/${package.Package}`,
        fields: [{
          name: `Add Repository`,
          value: `[Open In Safari](https://package-manager-links.minxteryt.repl.co/?repo=${package.repo.url})`,
          inline: true,
        },
        {
          name: `Section`,
          value: package.Section,
          inline: true,
        }
        ],
        thumbnail: {
          url: `https://api.parcility.co/db/package/${package.Package}/Icon`
        },
        footer: {
          text: "Showing " + 1 + "/" + body.data.length + " results for " + packageName,
          icon_url: package.repo.icon
        }
      };

      message.channel.send({
        components: row,
        embeds: result
      })
    }
  }
};