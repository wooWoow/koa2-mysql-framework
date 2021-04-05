import helper from "../utils/helper";
import utils from "../utils/utils";
import { logger } from "../../config/logger.config";
import nodeService from "../services/nodeService";

const path = require("path");
var os = require("os");
const upload = {
  UPLOAD: "/upload",
  IMAGE: "/images/",
  FILE: "/file/",
  MAXFILESIZE: 200 * 1024 * 1024, //上传文件大小
};

class nodeController {
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
      let data = await nodeService.saveNode(params);
      helper.responseFormat(ctx, 200, "文件保存成功", { id: data.insertId });
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息插入失败", err);
      logger.error("saveNode", "response:", err);
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
        let data = await nodeService.queryNode(params);
        helper.responseFormat(ctx, 200, "success", data);
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", { err: "缺失user_id" });
        logger.error("getNode", "response:", { err: "缺失user_id" });
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("getNode", "response:", err);
    }
  }

  /**
   * 删除 / 移入回收站 / 移出回收站
   */
  static async delNode(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);

      if (params.userId && ctx.params.id) {
        let queryParams = {
          user_id: params.userId,
          node_id: ctx.params.id,
          display: params.display,
        };
        let data = await nodeService.moveNodeToTrash(queryParams);
        helper.responseFormat(ctx, 200, "success", data);
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", { err: "缺失参数" });
        logger.error("delNode", "response:", { err: "缺失参数" });
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("delNode", "response:", err);
    }
  }

  /**
   * 笔记分类
   */
  static async getNodeType(ctx) {
    try {
      let data = await nodeService.queryNodeType();
      helper.responseFormat(ctx, 200, "success", data);
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("getNodeType", "response:", err);
    }
  }

  /**
   * 删除笔记分类
   */
  static async delNodeType(ctx) {
    try {
      if (ctx.params.id) {
        let data = await nodeService.delNodeType(ctx.params.id);
        if (data[0][0].failed === "failed") {
          helper.responseFormat(ctx, 501, "删除失败，存在引用", {
            err: "删除失败，存在引用",
          });
          logger.error("delNodeType", "response:", {
            err: "删除失败，存在引用",
          });
        } else {
          helper.responseFormat(ctx, 200, "success", {});
        }
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", { err: "缺失参数" });
        logger.error("delNodeType", "response:", { err: "缺失参数" });
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("delNodeType", "response:", err);
    }
  }

  /**
   * 新增笔记分类
   */
  static async addNodeType(ctx) {
    try {
      let params = Object.assign({}, ctx.request.query, ctx.request.body);
      if (params.nodeTypeStr) {
        let data = await nodeService.addNodeType(params);
        if (data[0][0].failed === "failed") {
          helper.responseFormat(ctx, 501, "新增失败已存在", {
            err: "新增失败已存在",
          });
          logger.error("addNodeType", "response:", {
            err: "新增失败已存在",
          });
        } else {
          helper.responseFormat(ctx, 200, "success", {});
        }
      } else {
        helper.responseFormat(ctx, 412, "参数缺失", { err: "缺失参数" });
        logger.error("addNodeType", "response:", { err: "缺失参数" });
      }
    } catch (err) {
      helper.responseFormat(ctx, 412, "信息查询失败", err);
      logger.error("addNodeType", "response:", err);
    }
  }
}

export default nodeController;
