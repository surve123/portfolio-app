package com.shreyassurve.portfolio.contact;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Very small in-memory rate limiter (per IP) to deter contact-form spam.
 * Resets whenever the app restarts — fine for a personal portfolio. Swap for
 * a Redis-backed limiter if this ever needs to handle real traffic.
 */
@Component
public class RateLimiter {

    private static final long WINDOW_MILLIS = 60_000; // 1 minute
    private static final int MAX_REQUESTS = 5;

    private final ConcurrentHashMap<String, Window> hits = new ConcurrentHashMap<>();

    public boolean tryAcquire(String key) {
        long now = System.currentTimeMillis();
        Window window = hits.compute(key, (k, existing) -> {
            if (existing == null || now - existing.start > WINDOW_MILLIS) {
                return new Window(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });
        return window.count.get() <= MAX_REQUESTS;
    }

    private static class Window {
        final long start;
        final AtomicInteger count = new AtomicInteger(1);

        Window(long start) {
            this.start = start;
        }
    }
}
