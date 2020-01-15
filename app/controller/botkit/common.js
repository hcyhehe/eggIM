module.exports = app => {
    //on监听所有
    app.bkController.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, {text:'机器人还在学习中，暂时不能识别'})
    })

    app.bkController.hears(['hi','hello','你好','您好'], ['message'], async (bot,message) => {
        await bot.reply(message,'您好~')
    })

    //中止对话
    app.bkController.interrupts(['quit','退出','中止'], ['message'], async(bot, message) => {
        await bot.reply(message, '已退出对话！')
        await bot.cancelAllDialogs()  // cancel any active dialogs
    })

    app.bkController.hears(new RegExp(/^reboot (.*?)$/i), 'message', async(bot, message) => {
        let param = message.matches[1]
        await bot.reply(message, `I will reboot ${ param }`)
    })

    app.bkController.hears('菜单', 'message', async(bot, message) => { 
        await bot.reply(message, {
            text: '以下是快捷菜单（若想退出某个对话，输入：中止）（命令行添加课程案例，输入：命令行课程添加 |教师名 | 课程名 | 星期几 | 9:00-10:00）',
            quick_replies: [
                { title: "做作业", payload: "做作业" },
                { title: "查作业", payload: "查作业" },
                { title: "查课程", payload: "查课程" },
                { title: "添加课程", payload: "添加课程" }
            ]
        })
    })

    app.bkController.hears('查课程', 'message', async(bot, message) => { 
        await bot.reply(message, {
            text: '请选择',
            quick_replies: [
                { title: "查询所有课程", payload: "查询所有课程" },
                { title: "查询单个课程", payload: "查询单个课程" }
            ]
        })
    })
    
}
