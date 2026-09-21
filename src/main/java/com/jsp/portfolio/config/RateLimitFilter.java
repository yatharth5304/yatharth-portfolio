package com.jsp.portfolio.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String key, int capacity, Duration refillPeriod) {
        return buckets.computeIfAbsent(key, k -> {
            Bandwidth limit = Bandwidth.classic(capacity, Refill.intervally(capacity, refillPeriod));
            return Bucket.builder().addLimit(limit).build();
        });
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String ip = getClientIp(request);
        String bucketKey = ip + ":" + path;

        Bucket bucket;
        int capacity;
        Duration refillPeriod;

        if (path.startsWith("/api/admin/")) {
            // Admin API: 30 requests per minute per IP
            capacity = 30;
            refillPeriod = Duration.ofMinutes(1);
        } else if (path.equals("/api/admin/csrf")) {
            // CSRF endpoint: 10 requests per minute
            capacity = 10;
            refillPeriod = Duration.ofMinutes(1);
        } else if (path.startsWith("/api/")) {
            // Public API: 120 requests per minute per IP
            capacity = 120;
            refillPeriod = Duration.ofMinutes(1);
        } else {
            // Static resources and HTML: no rate limiting
            filterChain.doFilter(request, response);
            return;
        }

        bucket = resolveBucket(bucketKey, capacity, refillPeriod);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again later.\"}");
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}