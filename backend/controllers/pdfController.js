const PDF = require("./../models/pdfModel");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const multerS3 = require("multer-s3");
const compressPdf = require("compress-pdf");
const fs = require("fs");
const path = require("path");
exports.getAll = async (req, res, next) => {
    try {
        const pdf = await PDF.find();
        res.status(200).json({
            status: "error",
            results: pdf.length,
            data: {
                pdf,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

// exports.createOneFileName = async (req, res, next) => {
//     try {
//         if (!req.doctor._id) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Doctor not found'
//             });
//         }

//         const pdf = await PDF.create({
//             filePath: req.body.filePath,
//             doctor: req.doctor._id,
//         });

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 pdf
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'error',
//             message: err.message
//         });
//     }
// }


// WITHOUT AWS

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = path.join(__dirname, "..", "public", "pdfs");
//         fs.mkdir(uploadDir, { recursive: true }, (err) => {
//             if (err) {
//                 return cb(err, null);
//             }
//             cb(null, uploadDir);
//         });
//     },
//     filename: (req, file, cb) => {
//         if (!req.doctor || !req.doctor._id) {
//             return cb(new Error("Doctor not found"), null);
//         }
//         const doctorId = req.doctor._id.toString();
//         const date = new Date().toISOString().replace(/:/g, "-");
//         cb(null, `${doctorId}-${date}-${file.originalname}`);
//     },
// });

// const upload = multer({ storage: storage }).single("pdf");


// WITh AWS

const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_DMS,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_DMS,
    },
  });

  
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME_DMS,
      acl: "private",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        if (!req.doctor || !req.doctor._id) {
          return cb(new Error("Doctor not found"), null);
        }
        const doctorId = req.doctor._id.toString();
        const date = new Date().toISOString().replace(/:/g, "-");
        cb(null, `pdfs/${doctorId}-${date}-${file.originalname}`);
      },
    }),
  }).single("pdf");


exports.uploadPDF = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({
                status: "error",
                message: `Multer upload error: ${err.message}`,
            });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({
                status: "error",
                message: `Unknown upload error: ${err.message}`,
            });
        }

        // Everything went fine.
        next();
    });
};

exports.createOne = async (req, res, next) => {
    try {
        if (!req.doctor || !req.doctor._id) {
            return res.status(400).json({
                status: "error",
                message: "Doctor not found",
            });
        }

        const file = req.file;
        const doctorId = req.doctor._id;
        console.log(file)

        if (!file) {
            return res.status(400).json({
                status: "error",
                message: "No file uploaded",
            });
        }

        // Create a new PDF document
        const pdf = await PDF.create({
            // filePath: file.path,
            filePath: file.location,
            doctor: doctorId,
        });

        res.status(201).json({
            status: "success",
            data: {
                pdf,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing your request",
        });
    }
};

exports.getLoggedinDoctor = async (req, res, next) => {
    try {
        if (!req.doctor._id) {
            return res.status(400).json({
                status: "error",
                message: "Doctor not found",
            });
        }

        const pdf = await PDF.find({ doctor: req.doctor._id });
        res.status(200).json({
            status: "success",
            data: {
                pdf,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                pdf,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.updateOne = async (req, res, next) => {
    try {
        const pdf = await PDF.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: "success",
            data: {
                pdf,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const pdf = await PDF.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};
