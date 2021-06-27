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
    name: "clickButton",
    once: false,
    run: async(client, button) => {
        let btn1 = new MessageButton().setEmoji('<:prev:855836521110044684>').setStyle('grey').setID('prev');
        let btn2 = new MessageButton().setEmoji('<:next:855836521402990592>').setStyle('grey').setID('next');
        let row = new MessageActionRow().addComponent(btn1).addComponent(btn2);

        packageName = button.message.embeds[0].footer.text.split(`for `)[1]
        index = button.message.embeds[0].footer.text.split("Showing ")[1].split("/")[0] - 1

        body = await fetch(`https://api.parcility.co/db/search?q=${packageName}`).then(res => res.json())
        if (!body.status) {
            message.reply("Nothing found with given params or parcility couldn't be reached.");
            return
        } else {


            if (button.id == "prev" && (index - 1) >= 0) {
                newindex = parseInt(index) - 1
            } else if (button.id == "next" && (index + 1) <= (body.data.length - 1)) {
                newindex = parseInt(index) + 1
            } else {
                newindex = index
            }

            package = body.data[newindex];

            smallResult = {
                title: package.Name,
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
                    text: "Showing " + parseInt(newindex + 1) + "/" + body.data.length + " results for " + packageName,
                    icon_url: package.repo.icon
                }
            };

            try {
                button.edit({
                    content: smallResult,
                    components: row
                })
            } catch (err) {
                console.log(err)
                button.defer()
            }

        }
    }
}