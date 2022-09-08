const {ipcMain} = require('electron')
const fs = require('fs')

function sendMsg () {
  ipcMain.on('sendMsg', (event, args) => {
    fs.readFile('d://test/hello.txt', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(args, '-------',data.toString());
      }
    })
    fs.unlink('d://test/delete.txt', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success---------', data);
      }
    })
  })
}

module.exports = {
  sendMsg
}