import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to, subject, text, html) => {
    try {
        
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        
        const mailOptions = {
            from: `<${process.env.EMAIL_USER}>`,
            to, 
            subject,
            text,
            html
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Email sending failed." };
    }
};

