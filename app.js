const { Botkit, BotkitConversation } = require('botkit')
const { WebAdapter } = require('botbuilder-adapter-web')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dbAdapter = new FileSync('db.json')
const db = low(dbAdapter)
const adapter = new WebAdapter()
const controller = new Botkit({
  adapter,
  // ...other options
})


class AppBootHook {
  constructor(app) {
    this.app = app
    this.app.db = db
    this.app.BotkitConversation = BotkitConversation
    this.app.bkController = controller
    this.app.DIALOG_ID_start = 'dialogID_1'
    this.app.DIALOG_ID_HOMEWORK = 'dialogID_2'
    this.app.DIALOG_ID_LESSON_FIND = 'dialogID_3'
    this.app.DIALOG_ID_LESSON_ADDONE = 'dialogID_4'
  }
  
  async serverDidReady() {
    // this.app.listen(8090, ()=>{})
    console.log('node server已启动，开始接受外部请求')
  }
}


module.exports = AppBootHook
