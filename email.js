const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Client ID
    'AbCdefGhIJKlmnopQRsTuvwxYZ', // Client Secret
    'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: '1//0gABCdEfGhIjKlMnOpQrStUvWxYz-1234567890' // Refresh Token
});

async function sendMail() {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'lindo1234monana@gmail.com', // Your Gmail address
                clientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Client ID
                clientSecret: 'AbCdefGhIJKlmnopQRsTuvwxYZ', // Client Secret
                refreshToken: '1//0gABCdEfGhIjKlMnOpQrStUvWxYz-1234567890', // Refresh Token
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'lindo1234monana@gmail.com', // Your Gmail address
            to: 'recipient@example.com', // Recipient's email address
            subject: 'Subject of the email',
            text: 'Body of the email',
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

sendMail().then(result => console.log('Email sent...', result))
    .catch(error => console.log(error.message));
