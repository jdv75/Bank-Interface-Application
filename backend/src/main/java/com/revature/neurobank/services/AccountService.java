package com.revature.neurobank.services;

import java.util.*;

import com.revature.neurobank.exceptions.*;
import com.revature.neurobank.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.revature.neurobank.dto.*;
import com.revature.neurobank.repositories.*;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

@Service 
public class AccountService {

    // This can be changed in the database
    private static final Integer DEFAULT_ROUTING_NUMBER = 123456789;

    private final AccountDAO accountDAO;
    private final UserDAO userDAO;
    private final BankDAO bankDAO;

    @Autowired 
    public AccountService(AccountDAO accountDAO, UserDAO userDAO, BankDAO bankDAO) {
        this.accountDAO = accountDAO;
        this.userDAO = userDAO;
        this.bankDAO = bankDAO;
    }

    public Account findOwnedAccount(String username, Integer accountId) {
        return accountDAO.findByAccountIdAndUsername_Username(accountId, username)
        .orElseThrow(() -> new AccountNotFoundException("Account " + accountId + " was not found."));
    }

    // Convert accounts into AccountResponse
    public List<AccountResponse> getAccountsForUser(String username) {
        return accountDAO.findByUsername_Username(username)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AccountResponse toResponse(Account account) {
        String id = String.valueOf(account.getAccountId());
        String type = account.getAccountType().name().toLowerCase();
        String name = type.substring(0, 1).toUpperCase() + type.substring(1) + " Account";
        String last4 = id.length() <= 4 ? id : id.substring(id.length() - 4);
        String routingNumber = account.getBankRoutingNum() == null?  null : String.valueOf(account.getBankRoutingNum().getRoutingNumber());
        double balance = account.getBalance() == null ? 0.0 : account.getBalance();

        return new AccountResponse(id, type, name, last4, balance, routingNumber);
        
    }

    public AccountResponse getAccount(String username, Integer accountId) {
        return toResponse(findOwnedAccount(username, accountId));
    }

    @Transactional 
    public AccountResponse createAccount(String username, CreateAccountRequest request) {
        if(request == null) {
            throw new InvalidAccountRequestException("Request body is required");
        }

        AccountType type = parseAccountType(request.type());

        String pin = request.pin();
        if(pin == null || !pin.matches("\\d{4}")) {
            throw new InvalidAccountRequestException("PIN must be exactly 4 digits.");
        }

        User user = userDAO.findById(username)
                    .orElseThrow(() -> new AccountNotFoundException("User " + username + " was not found."));

        Bank bank = bankDAO.findById(DEFAULT_ROUTING_NUMBER)
                    .orElseThrow(() -> new IllegalStateException("Default bank is not configured."));

        Account account = new Account();
        account.setPin(pin);
        account.setBalance(0.0);
        account.setUsername(user);
        account.setBankRoutingNum(bank);
        account.setAccountType(type);

        return toResponse(accountDAO.save(account));
    }


    @Transactional 
    public void deleteAccount(String username, Integer accountId) {
        Account account = findOwnedAccount(username, accountId);

        if(account.getBalance() != null && account.getBalance() != 0) {
            throw new AccountNotEmptyException("Transfer the remaining balance before closing this account.");
        }

        try {
            accountDAO.delete(account);
            accountDAO.flush();
        } catch (DataIntegrityViolationException e) {
            throw new AccountNotEmptyException("This account has transaction history and cannot be deleted.");
        }
    }

    private AccountType parseAccountType(String type) {
        if (type == null || type.isBlank()) {
            throw new InvalidAccountRequestException("Account type is required");
        }
        try {
            return AccountType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidAccountRequestException("Account type must be checking, savings, or investment.");
        }
    }


}
