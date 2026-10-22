package com.revature.neurobank.controllers;

import com.revature.neurobank.models.User;
import com.revature.neurobank.repositories.UserDAO;
import com.revature.neurobank.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDAO users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserDAO users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public record RegisterRequest(String accountId, String password) {}
    public record LoginRequest(String accountId, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        String id = req.accountId() == null ? "" : req.accountId().trim().toLowerCase();

        // Basic validation (matches frontend rules)
        if (id.length() < 4 || id.length() > 20 || !id.matches("^[a-zA-Z0-9_]+$")) {
            return ResponseEntity.badRequest().body(Map.of(
                "code", "VALIDATION_ERROR",
                "message", "Account ID must be 4-20 letters, numbers, or underscores.",
                "field", "accountId"
            ));
        }

        if (req.password() == null || req.password().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of(
                "code", "VALIDATION_ERROR",
                "message", "Password must be at least 8 characters.",
                "field", "password"
            ));
        }

        if (users.existsByUsername(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "code", "VALIDATION_ERROR",
                "message", "That account ID is already taken.",
                "field", "accountId"
            ));
        }

        User u = new User();
        u.setUsername(id);
        u.setPassword(encoder.encode(req.password()));
        users.save(u);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("accountId", u.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String id = req.accountId() == null ? "" : req.accountId().trim().toLowerCase();

        var userOpt = users.findByUsername(id);
        if (userOpt.isEmpty() || !encoder.matches(req.password(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "code", "INVALID_CREDENTIALS",
                "message", "Incorrect account ID or password."
            ));
        }

        User u = userOpt.get();
        String token = jwtService.generateToken(u.getUsername());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "account", Map.of("accountId", u.getUsername())
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String username = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        return users.findByUsername(username)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of("accountId", u.getUsername())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}