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


controller.hears(new RegExp('作业'), 'message', async(bot, message) => {
    await bot.beginDialog(MY_DIALOG_ID)
})


// send a greeting
convo.say('好的，接下来开始做作业~')

// ask a question, store the response in 'name'
convo.ask('What is your name?', async(response, convo, bot) => {
    console.log(`user name is ${ response }`);
    // do something?
}, 'name')

// use add action to switch to a different thread, defined below...
convo.addAction('favorite_color')

// add a message and a prompt to a new thread called `favorite_color`
convo.addMessage('Awesome {{vars.name}}!', 'favorite_color');
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
            // if user says no, go back to favorite color.
            await convo.gotoThread('favorite_color')
        }
    },
    {
        default: true,
        handler: async(response, convo, bot) => {
            // do nothing, allow convo to complete.
        }
    }
], 'confirm', 'confirmation')


controller.addDialog(convo)

