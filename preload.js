const {ipcRenderer} = require('electron')
const { contextBridge } = require('electron')

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  contextBridge.exposeInMainWorld('demo', {
    msg: 'hello, world'
  })

  ipcRenderer.on('getURLSchema', (event, arg) => {
    console.log('event', event);
    console.log('arg', arg);
    replaceText('schema', arg || '无')
  })
});


