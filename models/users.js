const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const crypto = require("crypto")
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:[true, "нэр оруулна уу"],
        // unique: true,
        trim: true,
        maxLength: [50, "нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"]
    },
    LastName:{
        type: String,
        required:[true, "овог оруулна уу"],
        // unique: true,
        trim: true,
        maxLength: [50, "нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"]
    },
    PhoneNumber:{
        type: Number,
        required: true,
        unique: true,
        minLength: [8, "утасны дугаар 8 оронтой байх хэрэгтэй"],
        maxLength: [9, "утасны дугаар 8 оронтой байх хэрэгтэй"],
    },
    email:{
        type: String,
        required: [true, "Бүртгэлтэй хэрэглэгч байна"],
        unique: [true, "Бүртгэлтэй хэрэглэгч байна"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "email хаяг буруу байна"],
    },
    password:{
        type: String,
        required: [true, "нууц үгээ оруулна уу"],
        minLength:[3, "нууц үг 8 ба түүнээс дээш тэмдэгт байх ёстой"],
        select: false,
    },
    userType:{
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

},{timestamps: true});
userSchema.pre('save', async function(next){
    //нууц үг өөрчлөгдөөгүй бол дараагын middleware рүү шилжинэ.
    if(!this.isModified("password")) next();

    //нууц үг өөрчлөгдсөн бол ажиллана
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJsonWebToken = function(){
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPRESIN,
    });
    return token;
};

userSchema.methods.checkPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.generatePasswordChangeToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 2 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model("users", userSchema);