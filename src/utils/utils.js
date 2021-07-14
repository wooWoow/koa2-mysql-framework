const child = require("child_process");
const fs = require("fs");
var readline = require('readline');
const path = require("path");
import { logger } from "../../config/logger.config";

class utils {
  /**
   * 执行命令
   * @param {*} script
   */
  static doExec(script) {
    return new Promise((resolve, reject) => {
      child.exec(script, function (err, sto) {
        if (sto) {
          resolve(sto);
        } else if (err) {
          reject(err);
        }
      });
    });
  }

  // 创建文件目录
  static mkdirFile(path) {
    let pathList = path.split("/");
    let fileDir = "./";
    pathList.forEach((i) => {
      if (i) {
        fileDir += "/" + i;
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, (err) => {
            logger.info("mkdirFile", "response:", { info: "创建失败" });
            return;
          });
        }
      }
    });
  }

  //保存文件
  static saveFile(file, path) {
    return new Promise((resolve, reject) => {
      let render = fs.createReadStream(file);
      // 创建写入流
      let upStream = fs.createWriteStream(path);
      render.pipe(upStream);
      upStream.on("finish", () => {
        resolve(path);
      });
      upStream.on("error", (err) => {
        reject(err);
      });
    });
  }

  static dateFormat(date) {
    const opt = {
      year: date.getFullYear().toString(), // 年
      month: (date.getMonth() + 1).toString(), // 月
      day: date.getDate().toString(), // 日
      hour: date.getHours().toString(), // 时
      minute: date.getMinutes().toString(), // 分
      sec: date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    return opt;
  }

  static readFile (path) {
    return new Promise((resolve, reject) => {
      var fRead = fs.createReadStream(path);
      var objReadline = readline.createInterface({
        input: fRead,
      });
      var arr = [];
      objReadline.on("line", function (line) {
        arr.push(line);
      });
      objReadline.on("close", function () {
        resolve(arr);
      });
    });
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export default utils;
