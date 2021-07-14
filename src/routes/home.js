import koaRouter from "koa-router";
import homeController from "../controllers/homeController";

const router = koaRouter();
/**
 * 接口路径加前缀
 */
router.prefix("/v1/home");

router.get("/humiture/today/minute", homeController.getTodayHumMin);

router.get("/humiture/today/hour", homeController.getTodayHumForHour);

router.get("/humiture/history/hour", homeController.getHistoryHumForHour);
export default router;
