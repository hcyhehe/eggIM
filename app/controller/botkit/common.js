module.exports = app => {
    app.bkController.hears(['hi','hello','你好','您好'], ['message'], async (bot,message) => {
        await bot.reply(message,'您好~')
    })

    app.bkController.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, {text:'机器人还在学习中，暂时不能识别'})
    })
    
    app.bkController.addDialog(app.convo)
}
