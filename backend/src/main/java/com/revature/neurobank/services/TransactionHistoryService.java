package com.revature.neurobank.services;

import com.revature.neurobank.dto.TransactionHistoryDTO;
import com.revature.neurobank.dto.TransactionHistoryPageDTO;
import com.revature.neurobank.exceptions.AccountNotFoundException;
import com.revature.neurobank.exceptions.InvalidAccountRequestException;
import com.revature.neurobank.models.Account;
import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionStatus;
import com.revature.neurobank.models.TransactionType;
import com.revature.neurobank.repositories.AccountDAO;
import com.revature.neurobank.repositories.TransactionDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class TransactionHistoryService {

    private static final int MAX_PAGE_SIZE = 100;
    private static final DateTimeFormatter SCHEDULED_DATE_FORMAT =
            DateTimeFormatter.ofPattern("MMM d, uuuu", Locale.US);

    private final TransactionDAO transactionDAO;
    private final AccountDAO accountDAO;

    @Autowired
    public TransactionHistoryService(TransactionDAO transactionDAO, AccountDAO accountDAO) {
        this.transactionDAO = transactionDAO;
        this.accountDAO = accountDAO;
    }

    public TransactionHistoryPageDTO getTransactionHistory(String username, Integer accountId,
                                                           int page, int pageSize, String type) {

        Account account = accountDAO.findByAccountIdAndUsername_Username(accountId, username)
                .orElseThrow(() -> new AccountNotFoundException("Account " + accountId + " was not found."));

        Pageable pageable = PageRequest.of(
                Math.max(page, 1) - 1,
                Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "date", "transactionId"));

        TransactionType transactionType = parseType(type);

        Page<Transaction> results = (transactionType == null)
                ? transactionDAO.findHistory(account.getAccountId(), pageable)
                : transactionDAO.findHistoryByType(account.getAccountId(), transactionType, pageable);

        List<TransactionHistoryDTO> transactions = results.getContent()
                .stream()
                .map(t -> toHistoryDTO(t, account.getAccountId()))
                .toList();

        return new TransactionHistoryPageDTO(transactions, results.getTotalElements());
    }

    private TransactionType parseType(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }
        try {
            return TransactionType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidAccountRequestException("Transaction type must be deposit, withdraw, or transfer.");
        }
    }

    private TransactionHistoryDTO toHistoryDTO(Transaction t, Integer viewedAccountId) {
        double amount = (t.getAmount() == null) ? 0.0 : t.getAmount();
        String createdAt = (t.getDate() == null) ? null : t.getDate().toString();

        String category;
        String name;
        String detail;

        switch (t.getTransactionType()) {
            case DEPOSIT -> {
                category = "cash";
                name = "Deposit";
                detail = "Cash deposit";
            }
            case WITHDRAW -> {
                amount = -amount;
                category = "atm";
                name = "Withdrawal";
                detail = "ATM withdrawal";
            }
            default -> { //TRANSFER
                Account destination = t.getDestinationAccountId();
                boolean incoming = destination != null && viewedAccountId.equals(destination.getAccountId());
                Account otherAccount = incoming ? t.getOriginAccountId() : destination;
                String otherLabel = getAccountLabel(otherAccount);

                if (!incoming) {
                    amount = -amount;
                }
                category = "internal-transfer";
                name = (incoming ? "From " : "To ") + otherLabel;
                detail = getTransferDetail(t, incoming, otherLabel);
            }
        }

        return new TransactionHistoryDTO(
                String.valueOf(t.getTransactionId()),
                String.valueOf(viewedAccountId),
                t.getTransactionType().name().toLowerCase(),
                category,
                name,
                detail,
                amount,
                createdAt,
                t.getStatus(),
                t.getNote(),
                t.getScheduledFor());
    }

    private String getTransferDetail(Transaction transaction, boolean incoming, String otherLabel) {
        String detail;

        if (transaction.getStatus() == TransactionStatus.SCHEDULED) {
            detail = "Scheduled for "
                    + transaction.getScheduledFor().format(SCHEDULED_DATE_FORMAT);
        } else if (transaction.getStatus() == TransactionStatus.FAILED) {
            detail = "Transfer failed";
        } else {
            detail = incoming
                    ? "Transfer from " + otherLabel
                    : "Transfer to " + otherLabel;
        }

        if (transaction.getNote() != null) {
            detail += " · " + transaction.getNote();
        }

        return detail;
    }

    private String getAccountLabel(Account account) {
        if (account == null || account.getAccountType() == null) {
            return "External";
        }
        String type = account.getAccountType().name().toLowerCase();
        return type.substring(0, 1).toUpperCase() + type.substring(1);
    }
}
