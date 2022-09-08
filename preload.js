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
  // replaceText('schema', 'uuuuuuuuuuuuu')

  contextBridge.exposeInMainWorld('demo', {
    sendMsg: (params) => {
      ipcRenderer.send('sendMsg', params)
    }
  })

  ipcRenderer.on('getURLSchema', (event, arg) => {
    console.log('event', event);
    console.log('arg', arg);
    // const url = new URL(arg)
    // console.log(url.searchParams.get('url'));
    replaceText('schema', arg || '无')
  })
});


