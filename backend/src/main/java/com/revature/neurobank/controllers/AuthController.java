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

    public record RegisterRequest(
        String accountId,
        String password,
        String fName,
        String lName,
        String email,
        String phone
    ) {}
    public record LoginRequest(String accountId, String password) {}

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    String id = req.accountId() == null ? "" : req.accountId().trim().toLowerCase();

    // Existing validation
    if (id.length() < 4 || id.length() > 20 || !id.matches("^[a-zA-Z0-9_]+$")) {
        return ResponseEntity.badRequest().body(Map.of(
            "code", "VALIDATION_ERROR",
            "message", "Username must be 4-20 letters, numbers, or underscores.",
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
            "message", "That username is already taken.",
            "field", "accountId"
        ));
    }

    User u = new User();
    u.setUsername(id);
    u.setPassword(encoder.encode(req.password()));

    // NEW: Personal info
    if (req.fName() != null) u.setfName(req.fName().trim());
    if (req.lName() != null) u.setlName(req.lName().trim());
    if (req.email() != null) u.setEmail(req.email().trim().toLowerCase());
    if (req.phone() != null) u.setPhone(req.phone().trim());

    users.save(u);

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
        "accountId", u.getUsername()
    ));
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String id = req.accountId() == null ? "" : req.accountId().trim().toLowerCase();

        var userOpt = users.findByUsername(id);
        if (userOpt.isEmpty() || !encoder.matches(req.password(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "code", "INVALID_CREDENTIALS",
                "message", "Incorrect username or password."
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
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                    "accountId", u.getUsername(),
                    "fName", u.getfName() == null ? "" : u.getfName(),
                    "lName", u.getlName() == null ? "" : u.getlName(),
                    "email", u.getEmail() == null ? "" : u.getEmail(),
                    "phone", u.getPhone() == null ? "" : u.getPhone()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}