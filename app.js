const { Botkit, BotkitConversation } = require('botkit')
const MY_DIALOG_ID = 'my-dialog-botkit'
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
const convo = new BotkitConversation(MY_DIALOG_ID, controller)


class AppBootHook {
  constructor(app) {
    this.app = app
    this.app.db = db
    this.app.bkController = controller
    this.app.convo = convo
    this.app.MY_DIALOG_ID = MY_DIALOG_ID
  }
  
  async serverDidReady() {
    // this.app.listen(8090, ()=>{})
    console.log('node server已启动，开始接受外部请求')
  }
}


module.exports = AppBootHook
