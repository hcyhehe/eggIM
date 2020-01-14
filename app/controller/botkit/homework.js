module.exports = app => {
    let that = this
    const convoHW = new app.BotkitConversation(app.DIALOG_ID_HOMEWORK, app.bkController)
    this.hw_msg = ''

    app.bkController.hears(new RegExp('做作业'), 'message', async(bot, message) => {
        that.hw_msg = message
        await bot.beginDialog(app.DIALOG_ID_HOMEWORK)
    })
    
    convoHW.say('好的，接下来准备做作业~')  //发送问候
    
    convoHW.ask('请输入您的名字', async(response, convo, bot) => {
        //console.log(`用户名： ${ response }`)
        await bot.reply(that.hw_msg, `你好，${ response }，现在开始答题`)  //可以防止addMessage重复显示
    }, 'name')
    
    //convoHW.addMessage('你好，{{vars.name}}！现在开始做作业', 'question1')
    convoHW.addAction('question1')
    convoHW.addQuestion('1.这个是问题一，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    
    convoHW.addAction('question2')
    convoHW.addQuestion('2.这个是问题二，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    
    convoHW.addAction('question3')
    convoHW.addQuestion('3.这个是问题三，请选择以下正确的答案: A.是的 B.不是 C.其他', [
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
    convoHW.addAction('confirmation', 'question3')
    convoHW.addQuestion('姓名:{{vars.name}}  1.{{vars.ques1}} 2.{{vars.ques2}} 3.{{vars.ques3}}  确定提交作业？', [
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
    
    
    convoHW.addAction('over')
    convoHW.addMessage('作业结束，辛苦啦~', 'over')    

    app.bkController.hears(new RegExp('查作业'), 'message', async(bot, message) => {
        let dbs = await app.db.get('homework').value()  //查询表名为homework的所有数据
        let str = ''
        for(let i=0;i<dbs.length;i++){
            str += i+1 + '.' + dbs[i].name + ':' + dbs[i].ques1 + ',' + dbs[i].ques2 + ',' + dbs[i].ques3 + ' ; ' 
        }
        str = str.substring(0, str.length-3)
        await bot.reply(message, {text:str})
    })

    app.bkController.addDialog(convoHW)
}
