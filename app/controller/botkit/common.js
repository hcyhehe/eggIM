module.exports = app => {
    app.bkController.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, {text:'暂时不能识别'})
    })
    
    app.bkController.addDialog(app.convo)
}
