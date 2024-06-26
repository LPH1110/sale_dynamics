import emailjs from '@emailjs/browser';

const sendVerification = async ({ to_email, to_name, from_name, message }) => {
    await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        'template_3oefpim',
        {
            to_email: to_email,
            to_name: to_name,
            from_name: from_name,
            message: message, // verify link
        },
        {
            publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
            privateKey: process.env.REACT_APP_EMAILJS_PRIVATE_KEY,
        },
    );
};

export default sendVerification;
