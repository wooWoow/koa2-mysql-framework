import koaRouter from "koa-router";
import infoController from "../controllers/infoController";

const router = koaRouter();
/**
 * 接口路径加前缀
 */
router.prefix("/v1/info");

router.get("/sys", infoController.getSysInfo);

export default router;
