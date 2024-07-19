const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Doctor',
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }

});

pdfSchema.pre(/^find/, function(next){
    this.populate({
        path: 'doctor',
        select: 'name _id email'
    });
    next();
});


const PDF = mongoose.model('PDF', pdfSchema);
module.exports = PDF;