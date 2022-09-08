const { app, BrowserWindow, ipcMain } = require("electron");
const {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
  singleInstance
} = require("./utils/pseudo-protocol");
const {sendMsg} = require('./utils/interact')
const path = require("path");
const fs = require('fs')

const _SCHEMAPROTOCOL = "electron-demo"; // 自定义协议名

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.loadFile("index.html");
  mainWindow.loadURL("http://127.0.0.1:5500/helper/embedded.html");
  
  // 打开开发工具
  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show() 
  })

  return mainWindow
};

app.whenReady().then(() => {
  const singleWindow = createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })

  // const schema = handleArgv(process.argv, _SCHEMAPROTOCOL);
  // const url = new URL(schema)
  // singleWindow.loadFile(url.searchParams.get('url'))

  singleWindow.send('getURLSchema', process.argv)

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

setDefaultProtocol(_SCHEMAPROTOCOL);
// deleteDefaultProtocol(_SCHEMAPROTOCOL);

// 交互部分
sendMsg()

