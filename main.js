const { app, BrowserWindow } = require("electron");
const {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
  singleInstance,
} = require("./utils/pseudo-protocol");
const { sendMsg } = require("./utils/interact");
const path = require("path");

const _SCHEMAPROTOCOL = "electron-demo"; // 自定义协议名

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const schema =
    handleArgv(process.argv, _SCHEMAPROTOCOL) ||
    // "electron-demo://?url=https://www.baidu.com";
    "electron-demo://?url=http://127.0.0.1:5500/helper/embedded.html";
  const schemaUrl = new URL(schema);
  mainWindow.loadURL(schemaUrl.searchParams.get("url"));

  mainWindow.send("getCurrentURL", schemaUrl.searchParams.get("url"));

  // 单实例
  singleInstance(mainWindow);
  // 打开开发工具
  mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  return mainWindow;
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

setDefaultProtocol(_SCHEMAPROTOCOL);
// deleteDefaultProtocol(_SCHEMAPROTOCOL);

// 交互部分
sendMsg();
