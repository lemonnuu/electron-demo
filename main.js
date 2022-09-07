const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
  singleInstance
} = require("./utils/pseudo-protocol");
const path = require("path");

const _SCHEMAPROTOCOL = "electron-demo";
let singleWindow = null

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.loadFile("index.html");
  mainWindow.loadURL("http://127.0.0.1:5501/embedded.html");
  
  // 打开开发工具
  // mainWindow.webContents.openDevTools();

  return mainWindow
};

app.whenReady().then(() => {
  singleWindow = createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })

  const test = handleArgv(process.argv, _SCHEMAPROTOCOL);
  singleWindow.send('getURLSchema', test)

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

setDefaultProtocol(_SCHEMAPROTOCOL);
// deleteDefaultProtocol(_SCHEMAPROTOCOL);
