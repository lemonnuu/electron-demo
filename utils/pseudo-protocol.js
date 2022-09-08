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
  let offset = 1
  if (!app.isPackaged) {
    offset++
  }
  const defaultSchema = (argv || []).find((item, index) => {
    return index >= offset && item.startsWith(`${scheme}://`);
  });
  return defaultSchema;
}

// 单实例
function singleInstance () {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    return app.quit()
  }
  app.on('second-instance', (event, argv) => {
    if (process.platform === 'win32') {
      // 这里还没写完, 拿到参数干什么
      handleArgv(argv)
    }
  })
  // 处理 MacOS 系统
  app.on('open-url', (event, url) => {
    // 这里也没写完, 拿到参数干什么
    handleURL(url)
  })
}

function handleURL(url) {
  return url
}

module.exports = {
  setDefaultProtocol,
  deleteDefaultProtocol,
  handleArgv,
  singleInstance
};
