package com.cineverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:3001/reset-password?token=" + token;
        
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;\">"
                + "<div style=\"text-align: center; padding-bottom: 20px;\">"
                + "<h1 style=\"color: #4f46e5; margin: 0; font-size: 28px;\">Cineverse</h1>"
                + "</div>"
                + "<div style=\"background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\">"
                + "<h2 style=\"color: #111827; margin-top: 0;\">Password Reset Request</h2>"
                + "<p style=\"color: #4b5563; font-size: 16px; line-height: 1.5;\">Hello,</p>"
                + "<p style=\"color: #4b5563; font-size: 16px; line-height: 1.5;\">We received a request to reset the password for your Cineverse account. If you didn't make this request, you can safely ignore this email.</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + resetUrl + "\" style=\"background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Reset Password</a>"
                + "</div>"
                + "<p style=\"color: #4b5563; font-size: 14px; line-height: 1.5;\">Or copy and paste this link into your browser:</p>"
                + "<p style=\"word-break: break-all; color: #4f46e5; font-size: 14px;\">" + resetUrl + "</p>"
                + "<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;\">"
                + "<p style=\"color: #9ca3af; font-size: 12px; text-align: center;\">This link will expire in 15 minutes.<br>Cineverse Team</p>"
                + "</div>"
                + "</div>";

        logger.info("=======================================================================");
        logger.info("PASSWORD RESET LINK FOR {}: {}", to, resetUrl);
        logger.info("=======================================================================");

        if (mailSender != null) {
            try {
                javax.mail.internet.MimeMessage message = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
                
                helper.setTo(to);
                helper.setSubject("Cineverse - Password Reset Request");
                helper.setText(htmlMessage, true); // true indicates HTML content
                
                mailSender.send(message);
                logger.info("HTML Password reset email sent successfully to {}", to);
            } catch (Exception e) {
                logger.error("Failed to send HTML password reset email to {}: {}", to, e.getMessage());
            }
        } else {
            logger.warn("JavaMailSender not configured. Email was not actually sent.");
        }
    }
}
