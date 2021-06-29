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
  name: "clickButton",
  once: false,
  run: async (client, button) => {
    let btn1 = new MessageButton().setEmoji('<:first:855836521110044684>').setStyle('grey').setID('first');
    let btn2 = new MessageButton().setEmoji('<:prev:858788835668656168>').setStyle('grey').setID('prev');
    let btn3 = new MessageButton().setEmoji('<:info:857412918843932702>').setStyle('grey').setID('info');
    let btn4 = new MessageButton().setEmoji('<:next:858788835629596713>').setStyle('grey').setID('next');
    let btn5 = new MessageButton().setEmoji('<:last:855836521402990592>').setStyle('grey').setID('last');
    let row = new MessageActionRow().addComponent(btn1).addComponent(btn2).addComponent(btn3).addComponent(btn4).addComponent(btn5);

    packageName = button.message.embeds[0].footer.text.split(`for `)[1]
    index = button.message.embeds[0].footer.text.split("Showing ")[1].split("/")[0] - 1
    currentsize = button.message.embeds[0].fields.length

    body = await fetch(`https://api.parcility.co/db/search?q=${packageName}`).then(res => res.json())
    if (!body.status) {
      message.reply("Nothing found with given params or parcility couldn't be reached.");
      return
    } else {


      if (button.id == "info" && currentsize == 2) {
        size = "large"
      } else {
        size = "small"
      }
      if (button.id == "prev" && (index - 1) >= 0) {
        newindex = parseInt(index) - 1
      } else if (button.id == "next" && (index + 1) <= (body.data.length - 1)) {
        newindex = parseInt(index) + 1
      } else if (button.id == "first") {
        newindex = parseInt(0)
      } else if (button.id == "last") {
        newindex = parseInt(body.data.length - 1)
      } else {
        newindex = index
      }

      package = body.data[newindex];

      try {
        extractColor = await getColorFromURL(`https://api.parcility.co/db/package/${package.Package}/Icon`);
        dominentColor = rgbToHex(extractColor[0], extractColor[1], extractColor[2]);
      } catch (err) {
        dominentColor = '#ffffff'
      }

      try {
        packageDepiction = await fetch(package.SileoDepiction).then(res => res.json())
        packageBanner = packageDepiction.headerImage
        embedColor = parseInt(packageDepiction.tintColor.replace('#', '0x'))
      } catch (err) {
        packageBanner = null
        embedColor = parseInt(dominentColor.replace('#', '0x'))
      }

      if (typeof (package.Tag) !== 'undefined') {
        if (package.Tag.includes('compatible_min::ios')) {
          splitTags = package.Tag.split('compatible_min::ios')
          minVer = splitTags[splitTags.length - 1].split(',')[0]
        } else {
          minVer = undefined;
        }

        if (package.Tag.includes('compatible_max::ios')) {
          splitTags = package.Tag.split('compatible_max::ios')
          maxVer = splitTags[splitTags.length - 1].split(',')[0]
        } else {
          maxVer = undefined;
        }
      }
      if (typeof (minVer) !== 'undefined' && typeof (maxVer) !== 'undefined') {
        supportedVers = `iOS ${minVer}-${maxVer}`
      }
      if (typeof (minVer) !== 'undefined' && typeof (maxVer) == 'undefined') {
        supportedVers = `iOS ${minVer}+`
      }
      if (typeof (minVer) == 'undefined' && typeof (maxVer) !== 'undefined') {
        supportedVers = `>= iOS ${maxVer}`
      }
      if (typeof (minVer) == 'undefined' && typeof (maxVer) == 'undefined') {
        if (typeof (package.Depends) !== 'undefined') {
          if (package.Depends.includes('firmware')) {
            splitDepends = package.Depends.split('firmware')
            supportedVers = splitDepends[splitDepends.length - 1].split(','[0])[0].split('(')[1].split(')')[0]
          } else {
            supportedVers = 'Unknown'
          }
        } else {
          supportedVers = 'Unknown'
        }
      }

      smallResult = {
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
          text: "Showing " + parseInt(newindex + 1) + "/" + body.data.length + " results for " + packageName,
          icon_url: package.repo.icon
        }
      };

      largeResult = {
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
        },
        {
          name: `Package version`,
          value: package.Version,
          inline: true,
        },
        {
          name: `Supported versions`,
          value: supportedVers,
          inline: true,
        },
        {
          name: `Author`,
          value: package.Author,
          inline: true,
        },
        ],
        thumbnail: {
          url: `https://api.parcility.co/db/package/${package.Package}/Icon`
        },
        image: {
          url: packageBanner
        },
        footer: {
          text: "Showing " + parseInt(newindex + 1) + "/" + body.data.length + " results for " + packageName,
          icon_url: package.repo.icon
        }
      };

      try {
        if (size == "small") {
          button.edit({
            content: smallResult,
            components: row
          })
        } else {
          button.edit({
            content: largeResult,
            components: row
          })
        }
      } catch (err) {
        console.log(err)
        button.defer()
      }

    }
  }
}