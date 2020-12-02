import koaRouter from "koa-router";
import infoController from "../controllers/infoController";

const router = koaRouter();
/**
 * 接口路径加前缀
 */
router.prefix("/v1/info");

router.post("/sysInfo", infoController.getSysInfo);

router.get("/goldInfo", infoController.getGoldInfo);

export default router;
