/**
 * Created by Amaya on 8/9/2014.
 */

var nodemailer = require("nodemailer");
var respond =  require("respond");


var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "doctorsnearme@gmail.com",
        pass: "raxadoctorsnearme2014"
    }
});

function mailOptionsObject(email,name){
    var mailOptions = {
        from: "doctorsnearme@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Doctors Near me", // Subject line
        text: "Hi " + name + ", try Doctors Near Me" // plaintext body
    };
    return mailOptions;
}
function sendEmail(response,data) {

    var string =data.emails;
    var array = JSON.parse(string);
    var triedCount = 0;
    var successCount=0;
    var message;
    console.log("no of emails:"+array.length);
    console.log(array);
    for (var i = 0; i < array.length; i++) {
        smtpTransport.sendMail(mailOptionsObject(array[i].email, array[i].name), function (error, result) {
            console.log(error);
            triedCount++;
            if(!error){
                successCount++;
                console.log("success count:"+successCount);
            }
            message = successCount+" out of "+triedCount+" successfully sent";
            console.log(message);
            if(triedCount== array.length){
                respond.emailRespond(response, message);
            }

        });
    }
}

exports.sendEmail = sendEmail;
