const express = require('express');

const pdfController = require('./../controllers/pdfController');
const doctorController = require('./../controllers/doctorController');
const router = express.Router();


router
    .route('/')
    .get(pdfController.getAll)
    // .post(
    //     doctorController.protect,
    //     pdfController.createOne)
    .post(
        doctorController.protect,
        pdfController.uploadPDF,
        pdfController.createOne)


router
    .route('/loggedinDoctor')
    .get(doctorController.protect, pdfController.getLoggedinDoctor)

router
    .route('/:id')
    .get(pdfController.getOne)
    .patch(pdfController.updateOne)
    .delete(pdfController.delete)


module.exports = router;
