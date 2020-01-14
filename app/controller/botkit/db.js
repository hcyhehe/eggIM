module.exports = app => {
    app.bkController.hears(new RegExp('数据库'), 'message', async(bot, message) => {
        let dbs = await app.db.get('homework').value()  //查询表名为homework的所有数据
        await bot.reply(message, {text:JSON.stringify(dbs)})
    })
        
    app.bkController.addDialog(app.convo)
}
