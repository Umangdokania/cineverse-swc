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
        String message = "To reset your password, click the link below:\n" + resetUrl;

        logger.info("=======================================================================");
        logger.info("PASSWORD RESET LINK FOR {}: {}", to, resetUrl);
        logger.info("=======================================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage email = new SimpleMailMessage();
                email.setTo(to);
                email.setSubject("Cineverse - Password Reset Request");
                email.setText(message);
                mailSender.send(email);
                logger.info("Password reset email sent to {}", to);
            } catch (Exception e) {
                logger.error("Failed to send password reset email to {}: {}", to, e.getMessage());
                // We don't throw the exception so the user flow still succeeds for local testing via console log
            }
        } else {
            logger.warn("JavaMailSender not configured. Email was not actually sent.");
        }
    }
}
