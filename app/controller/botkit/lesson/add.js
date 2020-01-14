module.exports = app => {
    let that = this
    const convoLesson = new app.BotkitConversation(app.DIALOG_ID_LESSON_ADDONE, app.bkController)
    this.lsn_msg = ''

    //问答式插入课程
    app.bkController.hears(new RegExp('添加课程'), 'message', async(bot, message) => {
        that.lsn_msg = message   //提供message上下文
        await bot.beginDialog(app.DIALOG_ID_LESSON_ADDONE)
    })

    convoLesson.say('好的，接下来准备添加课程~')

    convoLesson.ask('请输入您的名字', async(response, convo, bot) => {
        console.log('输入：', convo.vars.teacher)
    }, 'teacher')
    convoLesson.ask('请输入课程名称', async(response, convo, bot) => {
        console.log('输入：', convo.vars.name)
    }, 'name')
    convoLesson.ask('请输入这个课程是在星期几要上的（比如：星期二）', async(response, convo, bot) => {
        console.log('输入：', convo.vars.weekday)
    }, 'weekday')
    convoLesson.ask('请输入这个课程所在时间段（比如：8:30-9:30）', async(response, convo, bot) => {
        console.log('输入：', convo.vars.times)
    }, 'times')

    convoLesson.after(async(results, bot) => {
        console.log(results)
        await app.db.get('lesson').push({
            teacher: results.teacher,
            name: results.name,
            weekday: results.weekday,
            times: results.times
        }).write()  //写入lowdb
        let str = '添加成功！' + results.teacher + ':' + results.name + ',' + results.weekday + ',' + results.times 
        await bot.reply(that.lsn_msg, str)
    })



    //命令行添加课程
    app.bkController.hears(new RegExp(/^命令行课程添加 (.*?)$/i), 'message', async(bot, message) => {
        try{
            let arr = message.matches[1].replace(/\s/g,"").split('|')
            arr.shift()
            console.log(arr)
            let str
            if(arr.length>0){
                await app.db.get('lesson').push({
                    teacher: arr[0],
                    name: arr[1],
                    weekday: arr[2],
                    times: arr[3]
                }).write()
                str = '添加成功！' + '姓名：' + arr[0] + '，' + '课程：' + arr[1] + '，' + 
                      '日期：'+ arr[2] + ',' + arr[3] 
            } else {
                str = '参数格式不正确或参数为空'
            }
            await bot.reply(message, str)
        } catch(e) {
            console.log(e)
            await bot.reply(message, `参数解析出错，请重试`)
        }
    })


    app.bkController.addDialog(convoLesson)
}