module.exports = {
    name: "reload",
    description: "test",
    userOnly: "719292655963734056",
    run: async({ client, message }, args) => {
        commandName = args.join(' ')
        try {
            delete require.cache[require.resolve(`./${commandName}.js`)]
            client.commands.delete(commandName)
            const file = require(`./${commandName}.js`)
            client.commands.set(commandName, file)
            message.channel.send(`Reloaded ${commandName}!`)
        } catch (err) {
            message.channel.send('Something went wrong!')
        }
    }
}