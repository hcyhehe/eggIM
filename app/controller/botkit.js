let { Botkit } = require('botkit')
const { WebAdapter } = require('botbuilder-adapter-web')

const adapter = new WebAdapter()
const controller = new Botkit({
    adapter,
    // ...other options
})

controller.hears('hello','direct_message', function(bot, message) {
    bot.reply(message,'Hello yourself!')
})

