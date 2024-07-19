const express = require("express");

const doctorController = require("./../controllers/doctorController");
const router = express.Router();

router.post("/signup", doctorController.signup);
router.post("/login", doctorController.login);
router.get("/logout", doctorController.logout);
router.post("/forgotPassword", doctorController.forgotPassword);
router.patch("/resetPassword/:token", doctorController.resetPassword);

router.route("/").get(doctorController.getAll);

router
    .route("/:id")
    .get(doctorController.getOne)
    .patch(doctorController.updateOne)
    .delete(doctorController.deleteOne);

module.exports = router;
