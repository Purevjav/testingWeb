const mongoose = require("mongoose");
const lessonName = new mongoose.Schema({
    lessonName:{
        type: String,
        trim: true,
        unique: true,
        required: [true,"Хичээлийн нэрийг оруулна уу"]
    },
    photo:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default :Date.now,
    },
});

module.exports = mongoose.model("lessonName", lessonName);