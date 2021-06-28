const fetch = require("node-fetch");
const { MessageButton, MessageActionRow } = require("gcommands")
const Discord = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


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
    description: "Lookup a package",
    aliases: ["lookup"],
    cooldown: "5s",
    run: async({ client, message }, args) => {
        let btn1 = new MessageButton().setEmoji('<:first:855836521110044684>').setStyle('grey').setID('first');
        let btn2 = new MessageButton().setEmoji('<:prev:858788835668656168>').setStyle('grey').setID('prev');
        let btn3 = new MessageButton().setEmoji('<:info:857412918843932702>').setStyle('grey').setID('info');
        let btn4 = new MessageButton().setEmoji('<:next:858788835629596713>').setStyle('grey').setID('next');
        let btn5 = new MessageButton().setEmoji('<:last:855836521402990592>').setStyle('grey').setID('last');
        let row = new MessageActionRow().addComponent(btn1).addComponent(btn2).addComponent(btn3).addComponent(btn4).addComponent(btn5);
        packageName = args.join(" ").replace(new RegExp("@", "g"), '')
        if (packageName.length == 0) { message.channel.send("Specify a package name."); return }


        body = await fetch(`https://api.parcility.co/db/search?q=${packageName}`).then(res => res.json())

        if (!body.status) {
            message.reply("Nothing found with given params or parcility couldn't be reached.");
            return
        } else {

            package = body.data[0];

            try {
                extractColor = await getColorFromURL(`https://api.parcility.co/db/package/${package.Package}/Icon`);
                dominentColor = rgbToHex(extractColor[0], extractColor[1], extractColor[2]);
            } catch (err) { dominentColor = '#ffffff' }

            try {
                packageDepiction = await fetch(package.SileoDepiction).then(res => res.json())
                packageBanner = packageDepiction.headerImage
                embedColor = parseInt(packageDepiction.tintColor.replace('#', '0x'))
            } catch (err) {
                packageBanner = null
                embedColor = parseInt(dominentColor.replace('#', '0x'))
            }

            result = {
                title: package.Name,
                color: embedColor,
                description: truncateString(package.Description, 100),
                url: `https://parcility.co/package/${package.Package}`,
                fields: [{
                        name: `Add Repository`,
                        value: `[Open In Safari](https://package-manager-links.minxteryt.repl.co/${package.repo.url})`,
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