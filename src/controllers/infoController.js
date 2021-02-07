import request from "../utils/request";
import helper from "../utils/helper";
import utils from "../utils/utils";
import { logger } from "../../config/logger.config";
import txapiConfig from "../../config/txapi.config";
import InfoService from "../services/InfoService";

const path = require("path");
var os = require("os");
const upload = {
  UPLOAD: "/upload",
  IMAGE: "/images/",
  FILE: "/file/",
  MAXFILESIZE: 200 * 1024 * 1024, //上传文件大小
};

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
      helper.responseFormat(ctx, 412, "查询失败", { info: "参数缺失" });
      logger.info("sys/sysInfo", "response:", { info: "参数缺失" });
    }
  }

  /**
   * 获取金价信息
   */
  static async getGoldInfo(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    if (!params.kinds) {
      helper.responseFormat(ctx, 412, "查询失败", { info: "参数缺失(kinds)" });
      logger.info("sys/goldInfo", "response:", { info: "参数缺失(kinds)" });
    } else {
      const options = {
        method: "GET",
        path:
          "/txapi/gold/index?key=" + txapiConfig.key + "&kinds=" + params.kinds,
        requestType: "txapi",
      };
      let data = await request(options, {});
      helper.responseFormat(ctx, 200, "查询成功", data);
    }
  }

  /**
   * 图片上传
   */
  static async uploadFile(ctx) {
    var timeObj = utils.dateFormat(new Date());
    let date =
      timeObj.year +
      timeObj.month +
      timeObj.day +
      timeObj.hour +
      timeObj.minute +
      timeObj.sec;
    let file = ctx.request.files.image;
    let filePathOne = "assets" + upload.UPLOAD + upload.IMAGE; //上传保存目录
    let filePathTwo = date.substring(0, 4) + "/" + date.substring(4, 8);
    let tail = file.name == "blob" ? "png" : file.name.split(".").pop();
    let fileName = date + "." + tail;
    let filePath = path.join(filePathOne, filePathTwo); //根据时间拼接好文件名称

    await utils.mkdirFile(filePath);

    await utils
      .saveFile(file.path, path.join(filePath, fileName))
      .then((path) => {
        helper.responseFormat(ctx, 200, "文件上传成功", {
          path: path.replace("assets/", ""),
        });
      });
  }

  /**
   * 保存笔记
   */
  static async saveNode(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);
      let data = await InfoService.saveNode(params);
      helper.responseFormat(ctx, 200, "文件保存成功", { id: data.insertId });
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息插入失败", err);
      logger.error("users/login", "response:", err);
    }
  }

  /**
   * 查询笔记
   * 无id则查询列表，有id则查询单条
   */
  static async getNode(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);
      if (params.userId) {
        if (params.display === undefined) {
          params.display = 1;
        }
        let data = await InfoService.queryNode(params);
        helper.responseFormat(ctx, 200, "success", data);
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", {err: '缺失user_id'});
        logger.error("node/query", "response:", {err: '缺失user_id'});
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("node/query", "response:", err);
    }
  }

  static async delNode(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);

      if (params.userId && ctx.params.id) {
        let data = await InfoService.moveNodeToTrash({user_id: params.userId, node_id: ctx.params.id});
        helper.responseFormat(ctx, 200, "success", data);
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", {err: '缺失参数'});
        logger.error("node/query", "response:", {err: '缺失参数'});
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("node/query", "response:", err);
    }
  }
}

export default infoController;
