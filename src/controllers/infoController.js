import request from "../utils/request";
import helper from "../utils/helper";
import utils from "../utils/utils";
import { logger } from "../../config/logger.config";
import txapiConfig from "../../config/txapi.config";

var os = require("os");

class infoController {
  /**
   * 获取获取系统信息
   */
  static async getSysInfo(ctx) {
    let params = ctx.request.body || ctx.request.query;
    if (params && params.params && params.params.commond) {
      await utils.doExec(params.params.commond).then(
        (data) => {
          helper.responseFormat(ctx, 200, "查询成功", { info: data });
          logger.info("sys/sysInfo", "response:", { info: data });
        },
        (err) => {
          helper.responseFormat(ctx, 412, "查询失败", { info: err });
          logger.info("sys/sysInfo", "response:", { info: err });
        }
      );
    } else {
      helper.responseFormat(ctx, 412, "查询失败", { info: '参数缺失' });
      logger.info("sys/sysInfo", "response:", { info: '参数缺失' });
    }
  }

  static async getGoldInfo(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    if (!params.kinds) {
      helper.responseFormat(ctx, 412, "查询失败", { info: "参数缺失(kinds)" });
      logger.info("sys/goldInfo", "response:", { info: "参数缺失(kinds)" });
    } else {
      const options = {
        method: "GET",
        path: "/txapi/gold/index?key=" + txapiConfig.key + "&kinds=" + params.kinds,
        requestType: "txapi",
      };
      let data = await request(options, {});
      helper.responseFormat(ctx, 200, "查询成功", data);
    }
  }
}

export default infoController;
