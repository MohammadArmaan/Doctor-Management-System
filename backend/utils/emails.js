const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Define the mail options function
const createMailOptions = (to, subject, text) => {
    return {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text
    };
};

// Define the sendEmail function
const sendEmail = (to, subject, text, callback) => {
    const mailOptions = createMailOptions(to, subject, text);
    transporter.sendMail(mailOptions, callback);
};

module.exports = sendEmail;
