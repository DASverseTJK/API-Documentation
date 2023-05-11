const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testAcc8150@gmail.com',
      pass: 'vkzncvuameukbrdi'
    }
  });
  
  const mailOptions = {
    from: 'testAcc8150@gmail.com',
    to: 'tjmax0930@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from nodemailer.'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  