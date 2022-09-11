const mongoose = require("mongoose");
const testSchema = new mongoose.Schema({
    questionType:{
        type: String,
        trim: true,
        required: [true,"асуултын төрөлийг сонгоно уу"]
    },
    point:{
        type: Number,
        required: [true,"асуултын оноог оруулна уу"],
    },
    question:{        
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    createdAt:{
        type: Date,
        default :Date.now,
    },
    answers:[
            {   
                ansText:{
                    type: String,
                    trim: true,
                    // required: true,
                },
                isCorrect:{
                    type: Boolean,
                    select: false,
                }
            },
        ],  
});

module.exports = mongoose.model("testuud", testSchema);