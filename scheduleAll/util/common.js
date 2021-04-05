const fs = require("fs");
var readline = require('readline');

const common = {
  dateFormat: (date) => {
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
  },
  readFile: (path, callback) => {
    var fRead = fs.createReadStream(path);
    var objReadline = readline.createInterface({
      input: fRead,
    });
    var arr = [];
    objReadline.on("line", function (line) {
      arr.push(line);
    });
    objReadline.on("close", function () {
      callback(arr);
    });
  },
  addRowFile: (path, value, successCallback, errorCallback) => {
    fs.appendFileSync(path, value, (err) => {
      if (err) {
        errorCallback && errorCallback();
        console.log("err");
      } else {
        successCallback && successCallback();
        // console.log(minuteData);
      }
    });
  },
  writeFile: (path, value, successCallback, errorCallback) => {
    fs.writeFileSync(path, value, (err) => {
      if (err) {
        errorCallback && errorCallback();
        console.log("err");
      } else {
        successCallback && successCallback();
        // console.log(minuteData);
      }
    });
  }
};

module.exports = common;
