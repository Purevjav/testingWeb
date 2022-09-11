const express = require('express'); //import express
const {userAdd, testAuult, login, lessonType, testStart, userInfo, finish, userNumber, lessonSave, lessonView, lessonNemeh, forgotPassword, resetPassword} = require("./../controller/HomeController");
const router  = express.Router(); 
    router.route("/userRegister").get(userAdd).post(userAdd);
    router.route("/hadgalah").post(testAuult);
    router.route("/login").post(login);
    router.route("/lessonType").post(lessonType);
    router.route("/test").post(testStart);
    router.route("/userInfo").post(userInfo);
    router.route("/finish").post(finish);
    router.route("/userNumber").post(userNumber);
    router.route("/upload").post(lessonSave);
    router.route("/lessonName").post(lessonView);
    router.route("/lessonNemeh").post(lessonNemeh);
    router.route("/forgotPassword").post(forgotPassword);
    router.route("/resetPassword").post(resetPassword);
    module.exports = router; 
