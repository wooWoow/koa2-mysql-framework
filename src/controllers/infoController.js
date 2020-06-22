import request from "../utils/request";
import helper from "../utils/helper";
import utils from "../utils/utils";
import { logger } from "../../config/logger.config";

var os = require("os");

class infoController {
  /**
   * 获取系统状态，温度等
   */
  static async getSysInfo(ctx) {
    await utils.doExec("ls").then(
      (data) => {
        helper.responseFormat(ctx, 200, "查询成功", { info: data });
        logger.info("sys/info", "response:", { info: data });
      },
      (err) => {
        helper.responseFormat(ctx, 412, "查询失败", { info: err });
        logger.info("sys/info", "response:", { info: err });
      }
    );
  }
}

export default infoController;
