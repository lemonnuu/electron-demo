const { app } = require("electron");
const path = require("path");

// 添加自定义协议
function setDefaultProtocol(scheme) {
  if (process.platform === "win32") {
    const args = [];
    if (!app.isPackaged) {
      args.push(path.resolve(process.argv[1]));
    }
    //添加--防御自定义协议漏洞，忽略后面追加参数
    args.push("--");
    if (!app.isDefaultProtocolClient(scheme, process.execPath, args)) {
      app.setAsDefaultProtocolClient(scheme, process.execPath, args);
    }
  } else {
    if (!app.isDefaultProtocolClient(scheme)) {
      app.setAsDefaultProtocolClient(scheme);
    }
  }
}

// 删除自定义协议
function deleteDefaultProtocol(scheme) {
  if (process.platform === "win32") {
    const args = [];
    if (!app.isPackaged) {
      args.push(path.resolve(process.argv[1]));
    }
    args.push("--");
    if (app.isDefaultProtocolClient(scheme, process.execPath, args)) {
      app.removeAsDefaultProtocolClient(scheme, process.execPath, args);
    }
  } else {
    if (app.isDefaultProtocolClient(scheme)) {
      app.setAsDefaultProtocolClient(scheme);
    }
  }
}

// 根据 process.argv 获取自定义协议
function handleArgv(argv, scheme) {
  const defaultSchema = (argv || []).find((item, index) => {
    return item.startsWith(`${scheme}://`);
  });
  return defaultSchema;
}

module.exports = {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
};
