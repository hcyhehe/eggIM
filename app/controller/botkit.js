let { Botkit } = require('botkit')
const { WebAdapter } = require('botbuilder-adapter-web')

const adapter = new WebAdapter()
const controller = new Botkit({
    adapter,
    // ...other options
})


controller.hears(new RegExp(/^\d+$/), ['message', 'direct_message'], async function(bot, message) {
    await bot.reply(message, { text: '我懂了，您输入的是数字哦' })
})

controller.hears(new RegExp('作业'), 'message', async (bot, message) => {
    await bot.reply(message, {
        text: '1.这是第一题，以下哪些答案是正确的？',
        quick_replies: [
            { title: 'A 是', payload: 'A' },
            { title: 'B 否', payload: 'B' },
            { title: 'C 不清楚', payload: 'C' },
            { title: 'D 其他', payload: 'D' },
        ]
    }, function(){
        console.log('hehe')
    })
})

