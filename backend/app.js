const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const doctorPatientRoutes = require("./routes/doctorPatientRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(cors());

const corsOptions = {
    origin: "https://doctor-management-system-frontend.vercel.app", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
};

app.use(cors(corsOptions));

app.use(morgan("tiny"));

app.use(cookieParser());

app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/pdfUpload", pdfRoutes);
app.use("/api/v1/doctorPatient", doctorPatientRoutes);

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: "Hello, Welcome to DMS",

    })
})

app.get("/api/v1/auth/check", (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token is not valid" });
        }

        res.json({ user: decoded });
    });
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
    res.send(path.join(__dirname, 'frontend', 'index.html'));
  });

module.exports = app;