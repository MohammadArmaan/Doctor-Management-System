const express = require("express");

const patientController = require("./../controllers/patientController");
const router = express.Router();

router.post("/signup", patientController.signup);
router.post("/login", patientController.login);
router.get("/logout", patientController.logout);
router.post("/forgotPassword", patientController.forgotPassword);
router.patch("/resetPassword/:token", patientController.resetPassword);

router.route("/").get(patientController.getAll);

router
    .route("/:id")
    .get(patientController.getOne)
    .patch(patientController.updateOne)
    .delete(patientController.deleteOne);

module.exports = router;
