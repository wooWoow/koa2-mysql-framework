const schedule = require("node-schedule");
const common = require("../util/common");
const _ = require("lodash");
const child = require("child_process");

const getHumitureForHour = () => {
  let rule = new schedule.RecurrenceRule();
  rule.second = 0;
  rule.minute = 0;
  rule.hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  schedule.scheduleJob(rule, (date) => {
    const dateToObj = common.dateFormat(date);
    common.readFile("./export/tempAndHumForMinute.txt", (fileArr) => {
      let hour = dateToObj.hour - 1 >= 0 ? dateToObj.hour - 1 : 23;
      hour = hour.toString().length === 1 ? '0' + hour.toString() : hour.toString();
      let hourStr = ' ' + hour + ':';
  
      let timeStr = '';
      let temperatureArr = [];
      let humidityArr = [];
  
      _.each(fileArr, row => {
        if (row.indexOf(hourStr) >= 0) {
          timeStr = row.split(' +++ ')[0].split(':')[0] + ':00:00';
          temperatureArr.push(parseFloat(row.split(' +++ ')[1]));
          humidityArr.push(parseFloat(row.split(' +++ ')[2]));
        }
      });
  
      // 求每小时平均值
      let temperature = 0;
      _.each(temperatureArr, (temp) => {
        temperature += temp;
      });
      temperature = (temperature / temperatureArr.length).toFixed(2);
  
      let humidity = 0;
      _.each(humidityArr, (temp) => {
        humidity += temp;
      });
      humidity = (humidity / humidityArr.length).toFixed(2);
  
      const hourDate = timeStr + ' +++ ' + temperature + ' +++ ' + humidity + '\n';
      common.addRowFile("./export/tempAndHumForHour.txt", hourDate);
    });

    if (parseInt(dateToObj.hour) === 0) {
      setTimeout(() => {
        // 8s后清除当天数据，需要及时持久化
        common.writeFile("./export/tempAndHumForHour.txt", '');
        common.writeFile("./export/tempAndHumForMinute.txt", '');
      }, 8000);
    }
  });
}

const getHumitureForMinute = () => {
  // 每10s抓取一次数据
  let tempSecondBox = [];
  let rule = new schedule.RecurrenceRule();
  rule.second = [1, 11, 21, 31, 41, 51];
  schedule.scheduleJob(rule, (date) => {
    const dateToObj = common.dateFormat(date);
    humitureDo().then(
      (res) => {
        if (res.indexOf("Success") >= 0) {
          tempSecondBox.push(res);

          if (parseInt(dateToObj.sec) === 51) {
            let temperatureList = [];
            let humidityList = [];
            let timeStr = "";
            _.each(tempSecondBox, (second) => {
              temperatureList.push(parseFloat(second.split(" +++ ")[1]));
              humidityList.push(parseFloat(second.split(" +++ ")[2]));
              timeStr = second.split(" +++ ")[3];
            });

            // 求每小时平均值
            let temperature = 0;
            _.each(temperatureList, (temp) => {
              temperature += temp;
            });
            temperature = (temperature / temperatureList.length).toFixed(2);

            let humidity = 0;
            _.each(humidityList, (temp) => {
              humidity += temp;
            });
            humidity = (humidity / humidityList.length).toFixed(2);

            const minuteData =
              timeStr.split(":")[0] +
              ":" +
              timeStr.split(":")[1] +
              ":00" +
              " +++ " +
              temperature +
              " +++ " +
              humidity +
              "\n";
            common.addRowFile("./export/tempAndHumForMinute.txt", minuteData);

            tempSecondBox = [];
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  });
};

const humitureDo = () => {
  return new Promise((resolve, reject) => {
    child.exec("python3 ./script/DHT11.py", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

// 执行定时任务
const scheduleDo = () => {
  // 每分钟记录一次温度
  getHumitureForMinute();
  // 每小时求一次平局值
  getHumitureForHour();
};

module.exports = scheduleDo;
