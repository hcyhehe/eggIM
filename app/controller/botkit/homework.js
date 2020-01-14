module.exports = app => {
    app.bkController.hears(new RegExp('作业'), 'message', async(bot, message) => {
        await bot.beginDialog(app.MY_DIALOG_ID)
    })
    
    //发送问候
    app.convo.say('好的，接下来准备做作业~')
    
    //添加一个问题，将其存储在'name'里面
    app.convo.ask('请输入您的名字', async(response, convo, bot) => {
        console.log(`user name is ${ response }`)
    }, 'name')
    
    app.convo.addMessage('你好，{{vars.name}}！现在开始做作业', 'question1')
    
    app.convo.addAction('question1')
    app.convo.addQuestion('1.这个是问题一，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    
    app.convo.addAction('question2')
    app.convo.addQuestion('2.这个是问题二，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    
    app.convo.addAction('question3')
    app.convo.addQuestion('3.这个是问题三，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    app.convo.addAction('confirmation', 'question3')
    app.convo.addQuestion('姓名:{{vars.name}}  1.{{vars.ques1}} 2.{{vars.ques2}} 3.{{vars.ques3}}  确定提交作业？', [
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
                await app.db.get('homework').push(convo.vars).write()  //写入lowdb
                await convo.gotoThread('over')
            }
        }
    ], 'confirm', 'confirmation')
    
    
    app.convo.addAction('over')
    app.convo.addMessage('作业结束，辛苦啦~', 'over')    

    app.bkController.addDialog(app.convo)
}
