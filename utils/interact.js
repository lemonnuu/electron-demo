const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function sendMsg() {
  ipcMain.on("sendMsg", (event, arg) => {
    fs.readdir(arg, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        console.log(files);
        if (!files || !files.length) return;
        const usefulPromiseArr = files.map((item) => {
          return new Promise((resolve, reject) => {
            fs.stat(`${arg}${item}`, (err, stat) => {
              if (err) {
                reject(err);
              } else {
                stat.isFile() && path.extname(item) === ".txt"
                  ? resolve(item)
                  : reject(item);
              }
            });
          });
        });
        Promise.allSettled(usefulPromiseArr).then((res) => {
          if (!res || !res.length) return;
          const usefulArr = [];
          res.forEach((item) => {
            if (item.status === "fulfilled") {
              usefulArr.push(item.value);
            }
          });
          if (!usefulArr.length) {
            event.sender.send("receive", "无文本文件");
            return;
          }
          const contentPromiseArr = usefulArr.map((item) => {
            return new Promise((resolve, reject) => {
              fs.readFile(`${arg}${item}`, (err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  resolve(data.toString());
                }
              });
            });
          });
          Promise.all(contentPromiseArr).then((res) => {
            event.sender.send("receive", res);

            // 随机删除文件
            const deleteIndex = Math.floor(Math.random() * res.length);
            fs.unlink(`${arg}${files[deleteIndex]}`, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log(data);
              }
            });
          });
        });
      }
    });
  });
}

module.exports = {
  sendMsg,
};
