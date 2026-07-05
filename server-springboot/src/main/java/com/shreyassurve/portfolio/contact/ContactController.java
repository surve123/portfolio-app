package com.shreyassurve.portfolio.contact;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final EmailService emailService;
    private final RateLimiter rateLimiter;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public ContactController(EmailService emailService, RateLimiter rateLimiter) {
        this.emailService = emailService;
        this.rateLimiter = rateLimiter;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> body = new HashMap<>();
        body.put("ok", true);
        body.put("emailConfigured", !mailUsername.isBlank() && !mailPassword.isBlank());
        return body;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> contact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest
    ) {
        String ip = httpRequest.getRemoteAddr();
        if (!rateLimiter.tryAcquire(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many requests. Please try again in a minute."));
        }

        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Email is not configured on the server yet. Please email me directly instead."));
        }

        try {
            emailService.sendContactEmail(request);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send the message. Please try again shortly."));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String firstError = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("Invalid request.");
        return ResponseEntity.badRequest().body(Map.of("error", firstError));
    }
}
