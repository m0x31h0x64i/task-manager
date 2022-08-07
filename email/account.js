const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
})

const sendWelcomeEmail = (email, name) => {
    transporter.sendMail({
        to: email,
        subject: 'Welcome to task-manager app!',
        html: `Hello <b>${name}</b>👋🏻. If things went wrong let us know.
        <img src="cid:logo">`,
        attachments: [{
          path: __dirname + '/resource/welcome.jpg',
          cid: 'logo'
      }]
    })
}

const sendCancelationEmail = (email, name) => {
    transporter.sendMail({
      to: email,
      subject: 'Good bye!',
      html: `Hello <b>${name}</b>. sorry to see you go🥲
        <img src="cid:logo">`,
      attachments: [{
        path: __dirname + '/resource/goodbye.webp',
        cid: 'logo'
      }]
    })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}