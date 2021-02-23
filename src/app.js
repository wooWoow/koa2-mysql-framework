import Koa from "koa";
import session from "koa-session";
import views from "koa-views";
import json from "koa-json";
import onerror from "koa-onerror";
import koaBody from "koa-body";
import bodyparser from "koa-bodyparser";
import koaLogger from "koa-logger";
import path from "path";
import jwt from "koa-jwt";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import { errorRoute, notFoundRoute } from "./middleware/errorRouteCatch";
import { accessLogger, logger } from "../config/logger.config";
import sessConfig from "../config/session.config";
import routers from "./routes/index";

// error handler
const app = new Koa();
const publicKey = fs.readFileSync(path.join(__dirname, "../publicKey.pub"));
onerror(app);
logger.error("start app", "env:", process.env.NODE_ENV);

// 上传中间件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(accessLogger());
app.use(koaLogger());

// 静态资源
app.use(require("koa-static")(path.join(__dirname, "../assets")));

// router error
app.use(errorRoute());

// set the signature, control api to be accessed
app.use(
  jwt({
    secret: publicKey.toString(),
  }).unless({
    path: [
      /^\/v1\/users\/login/,
      /^\/v1\/home/,
      // /^\/v1\/info\/[\s\S]*/
    ],
  })
);

// set template type, if use hbs, only change "extension: 'hbs'" and "hbs: 'handlebars'"
app.use(
  views(__dirname + "/views", {
    extension: "html",
    map: { html: "handlebars" },
  })
);

// extends request header info
app.use(async (ctx, next) => {
  ctx.request.header.publicKey = publicKey.toString();

  // 解析token内容
  if (ctx.request.header.authorization) {
    let token = ctx.request.header.authorization;
    token = (token && token.split(" ")[1]) || "";
    ctx.request.header.tokenParse = jsonwebtoken.decode(token);
  }

  await next();
});

// if donot use session, you can remove the session middleware here.
app.keys = [publicKey.toString()];
app.use(session(sessConfig, app));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
routers.forEach((router) => {
  app.use(router.routes(), router.allowedMethods());
});

// not found router
app.use(notFoundRoute());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
  logger.error("server error", err, ctx);
});

module.exports = app;
