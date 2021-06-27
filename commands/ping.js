module.exports = {
    name: "ping",
    description: "Check bot ping",
    run: async({ respond }) => {
        respond("pong");
    }
};