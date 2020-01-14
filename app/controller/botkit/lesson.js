module.exports = app => {
    let that = this
    const convoLesson = new app.BotkitConversation(app.DIALOG_ID_LESSON, app.bkController)
    this.lsn_msg = ''

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
        that.lsn_msg = message   //提供message上下文
        await bot.beginDialog(app.DIALOG_ID_LESSON)
    })
    convoLesson.say('好的，接下来准备查询课程~')
    convoLesson.ask('请输入您的名字', async(response, convo, bot) => {
        console.log('输入：', convo.vars.teacher)
        let dbs = await app.db.get('lesson').find({teacher:convo.vars.teacher}).value()
        if(dbs){
            let str = dbs.teacher + ':' + dbs.name + ',' + dbs.weekday + ',' + dbs.times
            await bot.reply(that.lsn_msg, str)  //使用message上下文做响应
        } else {
            await bot.reply(that.lsn_msg, '查无结果')
        }
    }, 'teacher')

    app.bkController.addDialog(convoLesson)
}