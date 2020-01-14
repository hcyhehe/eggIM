module.exports = app => {
    const convoLesson = new app.BotkitConversation(app.DIALOG_ID_LESSON, app.bkController)

    //查所有教师的课程
    app.bkController.hears(new RegExp('查询所有课程'), 'message', async(bot, message) => {
        let dbs = await app.db.get('lesson').value()
        let str = ''
        for(let i=0;i<dbs.length;i++){
            str += i+1 + '.' + dbs[i].teacher + ':' + dbs[i].name + ',' + dbs[i].weekday + ',' + dbs[i].times + ' ; ' 
        }
        str = str.substring(0, str.length-3)
        await bot.reply(message, {text:str})
    })

    //查询单个课程
    app.bkController.hears(new RegExp('查课程'), 'message', async(bot, message) => {
        await bot.beginDialog(app.DIALOG_ID_LESSON)
    })
    convoLesson.say('好的，接下来准备查询课程~')
    convoLesson.ask('请输入您的名字', async(response, convo, bot) => {
        let dbs = await app.db.get('lesson').find({teacher:convo.vars.teacher}).value()
        console.log('dbs', dbs)
        if(dbs){
            let str = dbs.teacher + ':' + dbs.name + ',' + dbs.weekday + ',' + dbs.times
            await findOneResult(str)
        } else {
            await findOneResult('查无结果')
        }
    }, 'teacher')

    convoLesson.addAction('find_one_result')
    async function findOneResult(str){
        await convoLesson.addMessage(str, 'find_one_result') 
    }

    app.bkController.addDialog(convoLesson)
}