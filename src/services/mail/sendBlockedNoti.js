import emailjs from '@emailjs/browser';

const sendBlockedNoti = async ({ to_email, to_name, from_name }) => {
    await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        'template_fn01med',
        {
            to_email: to_email,
            to_name: to_name,
            from_name: from_name,
            message: '',
        },
        {
            publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
            privateKey: process.env.REACT_APP_EMAILJS_PRIVATE_KEY,
        },
    );
};

export default sendBlockedNoti;
