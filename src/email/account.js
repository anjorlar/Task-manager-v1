require('dotenv').config({ debug: process.env.DEBUG })
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeMail = async (email, name) => {
    try {
        await sgMail.send({
            to: email,
            from: 'devanjola@gmail.com',
            subject: 'Thanks for joining us',
            text: `Thanks ${name} for joining us let's know how you getting along with the app`,
            html: `<strong>Thanks ${name} for joining us let's know how you getting along with the app</strong>`,
        })
    } catch (error) {
        console.log('errror', error)
    }
};

const sendCancelMail = async (email, name) => {
    try {
        await sgMail.send({
            to: email,
            from: 'devanjola@gmail.com',
            subject: 'Do you want to delete your account',
            text: `Please ${name} how can we serve you better, Thanks`
        })
    } catch (error) {
        console.log('errror', error)
    }
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}
// sgMail.send(msg);
// sgMail
//     .send(msg)
//     .then(() => { }, error => {
//         console.error(error);

//         if (error.response) {
//             console.error(error.response.body)
//         }
//     });
