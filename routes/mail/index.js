// 发送邮件 主要用于修改密码确认，发送周报通知
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/resetPassConfirm', (req, res, next) => {

  const transport = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587, // secure true 465, secure false 587
    // secure: true,
    auth: {
      user: 'honeymorningofficial@outlook.com',
      pass: ''
    }
  });

  const mailOptions = {
    from: 'HoneyMorningOfficial <honeymorningofficial@outlook.com>',
    to: '1083926219@qq.com',
    subject: 'Reset Password',
    html: `
      <h1 style="font-size: 32px;">Hi sir or Ms:</h1>
      <p>If you are changing your password, please click this url to redirect <a href="https://www.honeymorning.com/resetpassword" target="_blank" rel="onopener">https://www.honeymorning.com/resetpassword</a></p>
      <p>Otherwise forget it please.</p>
      <br>
      <br>
      <br>
      <div><strong>HoneyMorning Official www.honeymorning.com</strong></div>
      <p>Any questions you could send an email to me <strong>Email: honeymorningofficial@outlook.com</strong></p>
    `
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.json({
        code: 4000,
        data: null,
        msg: 'something wrong'
      });
    } else {
      console.warn('Message %s sent: %s', info.messageId, info.response);
      res.json({
        code: 2000,
        data: null,
        msg: 'Mail sent success, later you will get email.'
      });
    }
  });

});

module.exports = router;
