package com.revature.neurobank.models;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity 
@Table(name = "transactions")
public class Transaction {

    @Id
    @Column 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @Column
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant date;

    @Column
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column 
    private Double amount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "origin_account_id")
    private Account originAccountId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_account_id")
    private Account destinationAccountId;

    @Column(length = 50)
    private String note;

    @Column(name = "scheduled_for")
    private LocalDate scheduledFor;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.COMPLETED;

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Account getOriginAccountId() {
        return originAccountId;
    }

    public void setOriginAccountId(Account originAccountId) {
        this.originAccountId = originAccountId;
    }

    public Account getDestinationAccountId() {
        return destinationAccountId;
    }

    public void setDestinationAccountId(Account destinationAccountId) {
        this.destinationAccountId = destinationAccountId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getScheduledFor() {
        return scheduledFor;
    }

    public void setScheduledFor(LocalDate scheduledFor) {
        this.scheduledFor = scheduledFor;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public Transaction() {
        
    }


    public Transaction(Integer transactionId, Instant date, TransactionType transactionType, Double amount, Account originAccountId) {
        this.transactionId = transactionId;
        this.date = date;
        this.transactionType = transactionType;
        this.amount = amount;
        this.originAccountId = originAccountId;
    }

    public Transaction(Integer transactionId, Instant date, TransactionType transactionType, Double amount, Account originAccountId, Account destinationAccountId) {
        this.transactionId = transactionId;
        this.date = date;
        this.transactionType = transactionType;
        this.amount = amount;
        this.originAccountId = originAccountId;
        this.destinationAccountId = destinationAccountId;
    }

    @PrePersist
    @PreUpdate
    private void validateState() {
        if (status == null) {
            throw new IllegalStateException("Transaction status is required.");
        }

        if (note != null && note.length() > 50) {
            throw new IllegalStateException("Transaction note cannot exceed 50 characters.");
        }

        if (status == TransactionStatus.SCHEDULED) {
            if (transactionType != TransactionType.TRANSFER) {
                throw new IllegalStateException("Only transfers can be scheduled.");
            }
            if (scheduledFor == null) {
                throw new IllegalStateException("A scheduled transfer requires a scheduled date.");
            }
        }

        if (transactionType != TransactionType.TRANSFER) {
            if (status != TransactionStatus.COMPLETED) {
                throw new IllegalStateException("Deposits and withdrawals must be completed.");
            }
            if (scheduledFor != null) {
                throw new IllegalStateException("Only transfers can have a scheduled date.");
            }
        }

        if (status == TransactionStatus.FAILED && transactionType != TransactionType.TRANSFER) {
            throw new IllegalStateException("Only transfers can fail during scheduled execution.");
        }
    }
}
