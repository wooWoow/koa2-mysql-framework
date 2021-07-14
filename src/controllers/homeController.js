import helper from "../utils/helper";
import utils from "../utils/utils";
import { logger } from "../../config/logger.config";
import homeService from "../services/homeService";

class homeController {
  /**
   * 获取今日温湿度
   */
  static async getTodayHumMin(ctx) {
    try {
      await utils.readFile('./scheduleAll/export/tempAndHumForMinute.txt').then(res => {
        helper.responseFormat(ctx, 200, "success", { info: res });
      });
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("getTodayHumiture", "response:", err);
    }
  }

  static async getTodayHumForHour(ctx) {
    try {
      await utils.readFile('./scheduleAll/export/tempAndHumForHour.txt').then(res => {
        // 空缺数据补全
        const list = res.map(item => {
          return {
            date: item.split(' +++ ')[0].split(' ')[1],
            temp: item.split(' +++ ')[1],
            hum: item.split(' +++ ')[2],
          };
        });

        let formatList = [];
        for (let i = 0; i<24; i++) {
          let find = false;
          let dateStr = '';
          if (i<= 9) {
            dateStr = '0' + i + ':00:00';
          } else {
            dateStr = i.toString() + ':00:00';
          }
          list.forEach(item => {
            if (item.date === dateStr) {
              find = true;
              formatList.push(item);
            }
          });
          if (!find) {
            formatList.push({
              date: dateStr,
              temp: '0',
              hum: '0'
            });
          }
        }

        helper.responseFormat(ctx, 200, "success", { info: formatList });
      });
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("getTodayHumForHour", "response:", err);
    }
  }

  static async getHistoryHumForHour(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);
      let data = await homeService.getHistoryHum(params);
      helper.responseFormat(ctx, 200, "数据获取成功", { data });
    } catch (err) {
      helper.responseFormat(ctx, 412, "数据获取失败", err);
      logger.error("getHistoryHumForHour", "response:", err);
    }
  }
}

export default homeController;
