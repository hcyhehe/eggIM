let { Botkit, BotkitConversation } = require('botkit')
const MY_DIALOG_ID = 'my-dialog-name-constant'
const { WebAdapter } = require('botbuilder-adapter-web')
//const { BotkitCMSHelper } = require('botkit-plugin-cms')   //botkit-cms插件
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbAdapter = new FileSync('db.json')
const db = low(dbAdapter)

const adapter = new WebAdapter()
const controller = new Botkit({
    adapter,
    // ...other options
})

// let cms = new BotkitCMSHelper({
//     uri: 'http://localhost:3000',
//     token: '123qweads'
// })
// controller.usePlugin(cms)


let convo = new BotkitConversation(MY_DIALOG_ID, controller)

controller.on('message,direct_message', async(bot, message) => {
    await bot.reply(message, {text:'暂时不能识别'})
})

controller.hears(new RegExp('作业'), 'message', async(bot, message) => {
    await bot.beginDialog(MY_DIALOG_ID)
})

controller.hears(new RegExp('数据库'), 'message', async(bot, message) => {
    let dbs = await db.get('homework').value()  //查询表名为homework的所有数据
    // console.log(dbs)
    // let str = ''
    // for(let i=0;i<dbs.length;i++){
    //     str += dbs[i].name + ':' + dbs[i].ques1 + ',' + dbs[i].ques2 + ',' + dbs[i].ques3 + ';'
    // }
    // str = str.substring(0, str.length - 1)
    await bot.reply(message, {text:JSON.stringify(dbs)})
})


//发送问候
convo.say('好的，接下来准备做作业~')

//添加一个问题，将其存储在'name'里面
convo.ask('请输入您的名字', async(response, convo, bot) => {
    console.log(`user name is ${ response }`)
}, 'name')

convo.addMessage('你好，{{vars.name}}！现在开始做作业', 'question1')

convo.addAction('question1')
convo.addQuestion('1.这个是问题一，请选择以下正确的答案: A.是的 B.不是 C.其他', [
    {
        pattern: 'A',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question2')
        },
    },
    {
        pattern: 'B',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question2')
        },
    },
    {
        pattern: 'C',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question2')
        },
    },
    {
        default: true,
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question1')
        },
    }
], 'ques1', 'question1')

convo.addAction('question2')
convo.addQuestion('2.这个是问题二，请选择以下正确的答案: A.是的 B.不是 C.其他', [
    {
        pattern: 'A',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question3')
        },
    },
    {
        pattern: 'B',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question3')
        },
    },
    {
        pattern: 'C',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question3')
        },
    },
    {
        default: true,
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question2')
        },
    }
], 'ques2', 'question2')

convo.addAction('question3')
convo.addQuestion('3.这个是问题三，请选择以下正确的答案: A.是的 B.不是 C.其他', [
    {
        pattern: 'A',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('confirmation')
        },
    },
    {
        pattern: 'B',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('confirmation')
        },
    },
    {
        pattern: 'C',
        handler: async function(response, convo, bot) {
            await convo.gotoThread('confirmation')
        },
    },
    {
        default: true,
        handler: async function(response, convo, bot) {
            await convo.gotoThread('question3')
        },
    }
], 'ques3', 'question3')

// go to a confirmation
convo.addAction('confirmation', 'question3')
convo.addQuestion('姓名:{{vars.name}}  1.{{vars.ques1}} 2.{{vars.ques2}} 3.{{vars.ques3}}  确定提交作业？', [
    {
        pattern: 'no',
        handler: async(response, convo, bot) => {
            await convo.gotoThread('question1')
        }
    },
    {
        default: true,
        handler: async(response, convo, bot) => {
            console.log(convo.vars)
            await db.get('homework').push(convo.vars).write()  //写入lowdb
            await convo.gotoThread('over')
        }
    }
], 'confirm', 'confirmation')


convo.addAction('over')
convo.addMessage('作业结束，辛苦啦~', 'over')


controller.addDialog(convo)




