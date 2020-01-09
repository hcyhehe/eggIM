require('./app/controller/botkit')  //botkit

class AppBootHook {
    constructor(app) {
      this.app = app
    }
    
    async serverDidReady() {
      // this.app.listen(8090, ()=>{})
      console.log('node server已启动，开始接受外部请求')
    }
}


module.exports = AppBootHook
