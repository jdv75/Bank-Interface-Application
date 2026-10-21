package com.revature.neurobank.controllers;
import org.springframework.web.bind.annotation.*;

import com.revature.neurobank.services.*;
import java.util.*;
import com.revature.neurobank.dto.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;


@RestController 
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // GET REQUESTS

    @GetMapping 
    public List<AccountResponse> getAccounts(@RequestHeader("X-Username") String username) {
        return accountService.getAccountsForUser(username);
    }

    @GetMapping("/{accountId}")
    public AccountResponse getAccount(@PathVariable Integer accountId, @RequestHeader("X-Username") String username) {
        return accountService.getAccount(username, accountId);
    }

    // POST REQUESTS
    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(@RequestBody CreateAccountRequest request, @RequestHeader("X-Username") String username) {
        return accountService.createAccount(username, request);
    }

    @PostMapping("/{accountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable Integer accountId, @RequestHeader("X-Username") String username) {
        accountService.deleteAccount(username, accountId);
    }


}
