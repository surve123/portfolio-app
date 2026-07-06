package com.shreyassurve.portfolio.contact;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final RestClient restClient = RestClient.create();

    // Where contact-form messages should land. Defaults to your own inbox.
    @Value("${app.contact.to-email:shreyassurve02@gmail.com}")
    private String toEmail;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    // Resend HTTP API key (https://resend.com). When set, email is sent over
    // HTTPS instead of SMTP — required on hosts like Render's free tier, which
    // block outbound SMTP connections entirely.
    @Value("${app.contact.resend-api-key:}")
    private String resendApiKey;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean isConfigured() {
        return true; // Return true to allow local testing and fall back to mock logging if no SMTP/Resend variables are set.
    }

    public void sendContactEmail(ContactRequest request) throws MessagingException {
        String subject = StringUtils.hasText(request.getSubject())
                ? request.getSubject().trim()
                : "New portfolio contact";

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

        if (StringUtils.hasText(resendApiKey)) {
            sendViaResend(subject, html, request.getEmail());
        } else if (StringUtils.hasText(fromEmail) && StringUtils.hasText(mailPassword)) {
            sendViaSmtp(subject, html, request.getEmail());
        } else {
            System.out.println("==================================================");
            System.out.println("[DEV MOCK MAIL] No credentials set. Mock sending:");
            System.out.println("To: " + toEmail);
            System.out.println("From (reply-to): " + request.getEmail());
            System.out.println("Subject: [Portfolio] " + subject);
            System.out.println("Content HTML:\n" + html);
            System.out.println("==================================================");
        }
    }

    private void sendViaResend(String subject, String html, String replyTo) throws MessagingException {
        try {
            restClient.post()
                    .uri("https://api.resend.com/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .body(Map.of(
                            "from", "Portfolio Contact <onboarding@resend.dev>",
                            "to", List.of(toEmail),
                            "reply_to", replyTo,
                            "subject", "[Portfolio] " + subject,
                            "html", html))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            throw new MessagingException("Failed to send email via Resend API", e);
        }
    }

    private void sendViaSmtp(String subject, String html, String replyTo) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setReplyTo(replyTo);
        helper.setSubject("[Portfolio] " + subject);
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
