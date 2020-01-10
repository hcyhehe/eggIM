let { Botkit, BotkitConversation } = require('botkit')
const MY_DIALOG_ID = 'my-dialog-name-constant'
const { WebAdapter } = require('botbuilder-adapter-web')
const adapter = new WebAdapter()
const controller = new Botkit({
    adapter,
    // ...other options
})

let convo = new BotkitConversation(MY_DIALOG_ID, controller)

// controller.hears(new RegExp('作业'), 'message', async (bot, message) => {
//     await bot.reply(message, {
//         text: '1.这是第一题，以下哪些答案是正确的？',
//         quick_replies: [
//             { title: 'A 是', payload: 'A' },
//             { title: 'B 否', payload: 'B' },
//             { title: 'C 不清楚', payload: 'C' },
//             { title: 'D 其他', payload: 'D' },
//         ]
//     })
// })

controller.on('message,direct_message', async(bot, message) => {
    await bot.reply(message, {text:'暂时不能识别'})
})

controller.hears(new RegExp('作业'), 'message', async(bot, message) => {
    await bot.beginDialog(MY_DIALOG_ID)
})


//发送问候
convo.say('好的，接下来开始做作业~')

//添加一个问题，将其存储在'name'里面
convo.ask('请输入您的名字', async(response, convo, bot) => {
    console.log(`user name is ${ response }`)
}, 'name')

// use add action to switch to a different thread, defined below...
convo.addAction('favorite_color')

// add a message and a prompt to a new thread called `favorite_color`
convo.addMessage('你好，{{vars.name}}！', 'favorite_color')
convo.addQuestion('Now, what is your favorite color?', async(response, convo, bot) => {
    console.log(`user favorite color is ${ response }`)
},'color', 'favorite_color')

// go to a confirmation
convo.addAction('confirmation' ,'favorite_color')

// do a simple conditional branch looking for user to say "no"
convo.addQuestion('Your name is {{vars.name}} and your favorite color is {{vars.color}}. Is that right?', [
    {
        pattern: 'no',
        handler: async(response, convo, bot) => {
            await convo.gotoThread('favorite_color')
        }
    },
    {
        default: true,
        handler: async(response, convo, bot) => {
            console.log(convo.vars)
            await convo.gotoThread('over')
        }
    }
], 'confirm', 'confirmation')


convo.addAction('over')
convo.addMessage('作业结束，辛苦啦~', 'over')


controller.addDialog(convo)

