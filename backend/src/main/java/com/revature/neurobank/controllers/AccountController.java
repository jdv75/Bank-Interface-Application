package com.revature.neurobank.controllers;
import org.springframework.web.bind.annotation.*;
import com.revature.neurobank.services.*;
import java.util.*;
import com.revature.neurobank.dto.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController 
@RequestMapping("/api/accounts")
// @CrossOrigin(origins = "http://localhost:5173") Not necessary since this is handled in spring security
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // Helper to get the logged-in user from the JWT
    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping 
    public List<AccountResponse> getAccounts() {
        return accountService.getAccountsForUser(getCurrentUsername());
    }

    @GetMapping("/{accountId}")
    public AccountResponse getAccount(@PathVariable Integer accountId) {
        return accountService.getAccount(getCurrentUsername(), accountId);
    }

    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(@RequestBody CreateAccountRequest request) {
        return accountService.createAccount(getCurrentUsername(), request);
    }

    @DeleteMapping("/{accountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable Integer accountId) {
        accountService.deleteAccount(getCurrentUsername(), accountId);
    }
}