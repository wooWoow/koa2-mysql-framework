import jwt from "jsonwebtoken";
import usersService from "../services/usersService";
import request from "../utils/request";
import helper from "../utils/helper";
import md5 from "../utils/crypto";
import { logger } from "../../config/logger.config";

class usersController {
  /**
   * 登录接口，没有被jwt拦截
   * 登录成功返回加签的token信息
   */
  static async login(ctx) {
    logger.error("users/login", "response:", process.env.NODE_ENV);
    let params = ctx.request.body || ctx.request.query;
    let userName = escape(params.userName);
    let passWord = escape(params.passWord);
    if (userName && passWord) {
      try {
        let data = await usersService.getUserInfo({ userName }, true);
        if (data[0] && data[0].user_password === md5(passWord)) {
          let userInfo = {
            user: {
              userId: data[0].user_id,
              userName: data[0].user_name,
              status: data[0].user_status,
              roles: data[0].user_roles
            },
          };
          let token = jwt.sign(userInfo, ctx.request.header.publicKey, {
            expiresIn: "2h",
          });
          userInfo.token = token;
          helper.responseFormat(ctx, 200, "登录成功", userInfo);
          logger.info("users/login", "response:", userInfo);
        } else {
          helper.responseFormat(ctx, 410, "用户名或者密码错误");
          logger.error("users/login", "response:", "用户名或者密码错误");
        }
      } catch (err) {
        helper.responseFormat(ctx, 412, "用户信息查询失败", err);
        logger.error("users/login", "response:", err);
      }
    } else {
      helper.responseFormat(ctx, 416, "查询参数缺失");
      logger.error("users/login", "params:", params);
    }
  }

  /**
   * 获取用户信息接口。
   * 如果没有获得授信将会被jwt拦截，测试时优先访问以上的login接口完成授信操作
   */
  static async getUserInfo(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    let token = jwt.verify(
      ctx.headers.authorization.split(" ")[1],
      ctx.request.header.publicKey
    );

    if (params.userName || params.userId) {
      if (
        params.userName === token.user.userName ||
        +params.userId === token.user.userId
      ) {
        try {
          let data = await usersService.getUserInfo(params, false);
          helper.responseFormat(ctx, 200, "查询成功", data);
          logger.info("users/getUserInfo", "response:", data);
        } catch (err) {
          helper.responseFormat(ctx, 412, "查询失败", err);
          logger.error("users/getUserInfo", "response:", err);
        }
      } else {
        helper.responseFormat(ctx, 412, "token信息和查询用户不匹配", {});
        logger.error(
          "users/getUserInfo",
          "response:",
          "token信息和查询用户不匹配"
        );
      }
    } else {
      helper.responseFormat(ctx, 416, "查询参数缺失");
      logger.error("users/getUserInfo", "response:", "查询参数缺失");
    }
  }

  /**
   * 修改用户密码
   */
  static async changePassword(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);

    if (params.userId && params.passWord && params.newPassword) {
      try {
        let userInfo = await usersService.getUserInfo(
          { userId: params.userId },
          true
        );

        if (md5(params.passWord) === userInfo[0].user_password) {
          const data = await usersService.changeUserPassword({
            userId: params.userId,
            passWord: md5(params.newPassword),
          });
          helper.responseFormat(ctx, 200, "修改成功", data);
          logger.info("users/changePassword", "response:", data);
        } else {
          helper.responseFormat(ctx, 412, "当前密码错误", {});
          logger.error("users/changePassword", "response:", "当前密码错误");
        }
      } catch (error) {
        helper.responseFormat(ctx, 412, "用户信息查询失败", error);
        logger.error("users/changePassword", "response:", error);
      }
    } else {
      helper.responseFormat(ctx, 416, "查询参数缺失");
      logger.error("users/changePassword", "response:", "查询参数缺失");
    }
  }

  /**
   * 新增用户
   */
  static async addUser(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);

    if (params.name && params.passWord) {
      const data = await usersService.addUser({
        name: params.name,
        passWord: md5(params.passWord),
        email: params.email,
        phone: params.phone,
        address: params.address,
        status: 0,
        roles: "operator",
      });

      helper.responseFormat(ctx, 200, "新增用户成功", data);
      logger.info("users/changePassword", "response:", data);
    } else {
      helper.responseFormat(ctx, 416, "查询参数缺失");
      logger.error("users/addUser", "response:", "查询参数缺失");
    }
  }

  /**
   * 获取用户列表
   */
  static async getUser(ctx) {
    let token = jwt.verify(
      ctx.headers.authorization.split(" ")[1],
      ctx.request.header.publicKey
    );
    const managerRole = token.user.roles.split(',').indexOf('manager') >= 0;
    if (managerRole) {
      const data = await usersService.getUser();
      helper.responseFormat(ctx, 200, "success", data);
      logger.info("users/getUser", "response:", data);
    } else {
      helper.responseFormat(ctx, 416, "无权限");
      logger.error("users/getUser", "response:", "无权限");
    }
  }

  /**
   * 变更用户状态
   */
   static async changeUserStatus(ctx) {
    let params = Object.assign({}, ctx.request.query, ctx.request.body);
    let token = jwt.verify(
      ctx.headers.authorization.split(" ")[1],
      ctx.request.header.publicKey
    );
    const managerRole = token.user.roles.split(',').indexOf('manager') >= 0;
    if (managerRole && params.userId !== undefined && params.status !== undefined) {
      const data = await usersService.userStatusChange(params);
      helper.responseFormat(ctx, 200, "success", data);
      logger.info("users/changeUserStatus", "response:", data);
    } else {
      helper.responseFormat(ctx, 416, "无权限");
      logger.error("users/changeUserStatus", "response:", "无权限");
    }
   }

  /**
   * 从远端请求数据
   */
  static async getRemoteData(ctx) {
    const options = {
      method: "GET",
      path: "/simpleWeather/query",
    };
    let data = await request(options, { city: "苏州", key: "2343423" });
    helper.responseFormat(ctx, 200, "查询成功", data);
  }

  /**
   * 从本地读取数据，读取方式采取异步读取
   */
  static async readFiles(ctx) {
    var path = require("path");
    let filepath = path.join(__dirname, "../files/test.json");
    let data = await helper.asyncReadFile(filepath);
    helper.responseFormat(ctx, 200, "查询成功", JSON.parse(data));
  }
}

export default usersController;
