module.exports = app => {
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

    app.bkController.addDialog(app.convo)
}