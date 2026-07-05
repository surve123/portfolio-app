package com.shreyassurve.portfolio.contact;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Where contact-form messages should land. Defaults to your own inbox.
    @Value("${app.contact.to-email:shreyas.surve02@gmail.com}")
    private String toEmail;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest request) throws MessagingException {
        String subject = StringUtils.hasText(request.getSubject())
                ? request.getSubject().trim()
                : "New portfolio contact";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setReplyTo(request.getEmail());
        helper.setSubject("[Portfolio] " + subject);

        String html = """
                <div style="font-family: sans-serif; line-height:1.6;">
                  <p><strong>Name:</strong> %s</p>
                  <p><strong>Email:</strong> %s</p>
                  <p><strong>Subject:</strong> %s</p>
                  <p><strong>Message:</strong></p>
                  <p>%s</p>
                </div>
                """.formatted(
                        escape(request.getName()),
                        escape(request.getEmail()),
                        escape(subject),
                        escape(request.getMessage()).replace("\n", "<br/>")
                );

        helper.setText(html, true);
        mailSender.send(message);
    }

    private String escape(String value) {
        if (value == null) return "";
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
