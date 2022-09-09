const { ipcRenderer, contextBridge } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const colorRandom = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  };

  contextBridge.exposeInMainWorld("demo", {
    sendMsg: (params) => {
      ipcRenderer.send("sendMsg", params);
      ipcRenderer.once("receive", (event, arg) => {
        if (!Array.isArray(arg)) {
          alert(arg);
          return;
        }
        const ulEle = document.createElement("ul");
        (arg || []).forEach((item) => {
          const liEle = document.createElement("div");
          liEle.innerText = item;
          ulEle.appendChild(liEle);
        });
        ulEle.style = `background:${colorRandom()}`;
        document.body.appendChild(ulEle);
      });
    },
  });

  ipcRenderer.once("getCurrentURL", (event, arg) => {
    if (document.getElementById("current-url")) {
      document.getElementById("current-url").innerText = `当前加载网页：${arg}`;
    }
  });
});
