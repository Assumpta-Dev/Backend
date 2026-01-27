// src/services/email.service.ts
import { transporter } from "../config/email.config";
import { welcomeEmailTemplate, passwordResetTemplate, orderConfirmationTemplate, } from "../template/email.template";
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Your App" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
    }
    catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Failed to send email");
    }
};
export const sendWelcomeEmail = async (email, firstName) => {
    await sendEmail({
        to: email,
        subject: "Welcome to Our Platform!",
        html: welcomeEmailTemplate(firstName, email),
    });
};
export const sendPasswordResetEmail = async (email, firstName, resetToken) => {
    await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html: passwordResetTemplate(firstName, resetToken),
    });
};
export const sendOrderConfirmationEmail = async (email, firstName, orderId, total) => {
    await sendEmail({
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html: orderConfirmationTemplate(firstName, orderId, total),
    });
};
//# sourceMappingURL=email.service.js.map