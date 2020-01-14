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
    this.app.DIALOG_ID_HOMEWORK = 'my-dialog-botkit-1'
    this.app.DIALOG_ID_LESSON = 'my-dialog-botkit-2'
  }
  
  async serverDidReady() {
    // this.app.listen(8090, ()=>{})
    console.log('node server已启动，开始接受外部请求')
  }
}


module.exports = AppBootHook
