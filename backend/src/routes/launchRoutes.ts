import { Router } from "express";
import { LaunchController } from "../controllers/launchController";

const router = Router();
const controller = new LaunchController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);

export default router;