import koaRouter from "koa-router";
import nodeController from "../controllers/nodeController";

const router = koaRouter();
/**
 * 接口路径加前缀
 */
router.prefix("/v1/node");

router.post("/upload", nodeController.uploadFile);

router.post("/save", nodeController.saveNode);

router.get("/query", nodeController.getNode);

router.delete("/:id", nodeController.delNode);

router.get("/type", nodeController.getNodeType);

router.delete("/type/:id", nodeController.delNodeType);

router.post("/type/add", nodeController.addNodeType);

export default router;
