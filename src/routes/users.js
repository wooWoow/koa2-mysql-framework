import koaRouter from "koa-router";
import usersController from "../controllers/usersController";

const router = koaRouter();
/**
 * 接口路径加前缀，如访问时使用 http://localhost:3000/v1/users/getUserInfoByUserId
 */
router.prefix("/v1/users");

// 登录
router.post("/login", usersController.login);

// 读取用户数据
router.get("/getUserInfo", usersController.getUserInfo);

// 密码修改
router.post("/changePassword", usersController.changePassword);

// 新增用户
router.post("/addUser", usersController.addUser);

// 用户列表
router.get("/getUser", usersController.getUser);

// 变更用户状态
router.post("/changeUserStatus", usersController.changeUserStatus);

// 测试访第三方接口
router.get("/getRemoteData", usersController.getRemoteData);

// 本地读取文件数据
router.get("/readFiles", usersController.readFiles);

export default router;
