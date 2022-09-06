const { app, BrowserWindow } = require("electron");
const {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
} = require("./utils/pseudo-protocol");
const path = require("path");

const _SCHEMAPROTOCOL = "electron";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  // 打开开发工具
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const test = handleArgv(process.argv, _SCHEMAPROTOCOL);
  console.log("------888------", test);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

setDefaultProtocol(_SCHEMAPROTOCOL);
// deleteDefaultProtocol(_SCHEMAPROTOCOL);

// console.log("process.platform", process.platform);
// console.log("app.isPackaged", app.isPackaged);
// console.log("process.argv", process.argv);
// console.log("process.execPath", process.execPath);
