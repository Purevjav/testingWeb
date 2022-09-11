const users = require('../models/users');
const testuud = require('../models/testuud');
const lesson = require('../models/lessonName');
const MyError = require('../utils/MyError');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
// finish
const finish = asyncHandler(async (req, res, next) => {
    var ansCorrect = [];

    const docs = await testuud.find({  questionType: hicheelNer() }).select('+answers.isCorrect');

    docs.forEach(async function(value){
       await value.answers.forEach(element => {
            if(element.isCorrect === true){
               ansCorrect.push({correct : element.ansText, point : value.point});

            }
        });
    });
    var sumPoint = 0;
    await req.body.forEach(async answer =>{
       await ansCorrect.forEach(correct =>{
        if(answer){
            if(answer.ansText === correct.correct){
                sumPoint +=correct.point;
            } 
        }
        })
    })
    // console.log("point :", sumPoint);
    res.status(200).json({
        success: true,
        data: sumPoint,
    })
});
//хэрэглэгч бүртгэх
const userAdd = asyncHandler( async (req, res, next) => {
        // console.log("req.body :", req.body);
        const myData = new users(req.body);
        await myData.save().then((result) =>{
            res.status(200).json({
            success: true,
            data:"aмжилттай бүртгэгдэлээ"
            });
        });
        const token = user.getJsonWebToken();
        res.status(200).json({
        success: true,
        token,
        data: burtgeh,
    })

});
//асуулт бүртгэх
const testAuult = asyncHandler( async(req, res, next) =>{

        // console.log("req.body : ", JSON.stringify(req.body));
        const blog = new testuud(req.body);
        blog.save().then((result) =>{
            res.status(200).json({
            success: true,
            data:"aмжилттай нэмэгдлээ"
            });
        });
});
// Хэрэглэгч нэвтрэх
const login = asyncHandler( async(req, res, next) =>{ 
        const { email , password} = req.body;
        //оролтыг шалгана
        if(!email || !password){
            throw new MyError("email болон нууц оруулна уу", 400);
        }
        //тухайн хэрэглэгчийг хайна
        const user = await users.findOne({ email }).select('+password');

        if(!user){
            throw new MyError("email эсвэл нууц үг буруу байна", 401);
        }
        const ok = await user.checkPassword(password);
        if(!ok){
            throw new MyError("email эсвэл нууц үг буруу байна", 401);
        }
        // console.log("torol : ", user.torol);
        const token = user.getJsonWebToken(); 
        // console.log("user : ", user);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            success: true,
            userType: user.userType,
            token: token,
            name: user.firstName,
        })

});
var lessonName = null;
function hicheelNer(){
    var name = lessonName;
    return name;
} 
//хичээлийн төрөл орж ирнэ.
const lessonType = asyncHandler( async(req, res, next) =>{
        lessonName = req.body.lessonName;
});
//тест эхлүүлэх гээд дархад ажиллана.
const testStart = asyncHandler( async(req, res, next) =>{
    const docs = await testuud.find({questionType: hicheelNer()});
    var myArr = [];

    await docs.forEach(function(value){
        myArr.push({question : value.question, point: value.point, answers: value.answers});
    });
    res.send(myArr.sort(() => Math.random() - 0.5));
});
//Хэрэглэгчдийн мэдээлэл харах
const userInfo = asyncHandler( async(req, res, next) =>{
    const info = await users.find({ userType: "user"});
    myArr = [];
    await info.forEach(function(value){
        // const t = value.createdAt.toString();
        const  t = value.createdAt.toISOString().split('').reverse().join('').substring(14).split('').reverse().join('');
        // const n = new Date(t);
        const n = t;
        myArr.push({firstName: value.firstName, LastName: value.LastName, phone: value.PhoneNumber, email: value.email, CreateDate: n})
    })
    res.send(myArr);
});
//хэрэглэгчдийн тоо
const userNumber = asyncHandler( async(req, res, next)=>{
    arr = [];
    // console.log("huselt orj irsen");
    const user = await users.find({userType: "user"});
    const admin = await users.find({userType: "Админ"});
    const operator = await users.find({userType: "Оператор"});
    const math = await testuud.find({ questionType: "Математик"});
    const pizik = await testuud.find({questionType: "Физик"}); 
    const himi = await testuud.find({questionType: "Хими"});
    const mongolHel = await testuud.find({questionType: "Монгол хэл"});
    arr.push({user : user.length, admin: admin.length, operator: operator.length, math: math.length, pizik: pizik.length, himi: himi.length, mongolHel: mongolHel.length});
    res.send(arr);
});

//хичээл хадгалах
const lessonSave = asyncHandler( async (req, res, next) =>{
    // console.log("req.body :", req.body);
    // console.log("req.files :", req.files.file);
    const file = req.files.file;
    if(!file.mimetype.startsWith("image")){
        throw new MyError("Та зураг оруулна уу?", 400);
    }
    if(file.size > process.env.MAX_UPLOAD_FILE_SIZE){
          throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна", 400);
    }
    file.name = `photo_${req.body.lessonName}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err =>{
        if(err){
            throw new MyError("файлыг хуулах явцад алдаа гарлаа. ", err.message, 400);
        }
    });
    let lessonName = {
        lessonName: req.body.lessonName,
        photo: `${process.env.FILE_UPLOAD_PATH}/${ file.name}`,
    }
    const myData = new lesson(lessonName);
        await myData.save().then((result) =>{
            res.status(200).json({
            success: true,
            data:"aмжилттай нэмэгдлээ"
            })
        });
    // console.log("file.name :", file.name);
});
//баазад хадгалсан хичээл харуулах
const lessonView = asyncHandler( async (req, res, next) =>{
     const docs = await lesson.find({});
     res.status(200).json({
        success: true,
        data: docs,
     })
});
//хичээл лекц семинар оруулах
const lessonNemeh =asyncHandler( async (req, res, next) =>{
    console.log("req.files :", req.files);
    res.json("amjilttai")
});

//нууц үг сэргээх
const forgotPassword = asyncHandler( async (req, res, next) =>{
    const user = await users.findOne({email: req.body.searchEmail});
    if(!user){
        throw new MyError(req.body.searchEmail + " имэйлтэй хэрэглэгч бүртгэгдээгүй байна", 400);
    }
    const resetToken = user.generatePasswordChangeToken();
    await user.save();

    //email илгээнэ
    const link = `http://localhost:8080/changepassword/${resetToken}`;
    const message = `Сайн байна уу? <br><br> Та нууц үгээ солих хүсэлт илгээлээ.<br> Нууц үгээ доорхи линк дээр дарж шинэчилнэ үү <br><a href="${link}">${link}<a/>`
    const info =  await sendEmail({
        email: user.email,
        subject: "нууц үг өөрчлөх хүсэлт",
        message,
    });
    res.status(200).json({
        success: true,
        message: `нууц үг солих хаягыг таны бүртгэлтэй имэйл хаягруу илгээлээ имэйлээ шалгана уу`,
    })
});

//resetPassword
const resetPassword = asyncHandler( async (req, res, next) =>{
    if(!req.body.resetToken || !req.body.newPassword){
        throw new MyError("та токен болон нууц үгээ дамжуулна уу", 400);
    }
    const encrypted = crypto.createHash('sha256').update(req.body.resetToken).digest('hex');


    const user = await users.findOne({resetPasswordToken: encrypted, resetPasswordExpire:{ $gt: Date.now() }});

    if(!user){
        throw new MyError(`Нууц үг солих хугацаа дууссан байна дахин оролдоно уу`, 400)
    }else{
        user.password = req.body.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

    const token = user.getJsonWebToken();

    res.status(200).json({
        success: true,
        token,
        name: user.firstName,
        userType: user.userType,
        message: "нууц үг амжилттай шинэчлэгдэлээ",
    })
    }


});
module.exports = { userAdd, testAuult, login, lessonType, testStart, userInfo, finish, userNumber, lessonSave, lessonView, lessonNemeh, forgotPassword, resetPassword};

