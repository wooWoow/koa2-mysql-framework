import koaRouter from "koa-router";
import infoController from "../controllers/infoController";

const router = koaRouter();
/**
 * 接口路径加前缀
 */
router.prefix("/v1/info");

router.post("/sysInfo", infoController.getSysInfo);

router.get("/goldInfo", infoController.getGoldInfo);

router.post("/upload", infoController.uploadFile);

router.post("/node/save", infoController.saveNode);

router.get("/node/query", infoController.getNode);

router.delete("/node/:id", infoController.delNode);

router.get("/node/type", infoController.getNodeType);

router.delete("/node/type/:id", infoController.delNodeType);

router.post("/node/type/add", infoController.addNodeType);

export default router;
