package com.revature.neurobank.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity 
@Table(name = "transactions")
public class Transaction {

    @Id
    @Column 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @Column 
    private LocalDateTime date;

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

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
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

    public Transaction() {
        
    }


    public Transaction(Integer transactionId, LocalDateTime date, TransactionType transactionType, Double amount, Account originAccountId) {
        this.transactionId = transactionId;
        this.date = date;
        this.transactionType = transactionType;
        this.amount = amount;
        this.originAccountId = originAccountId;
    }

    public Transaction(Integer transactionId, LocalDateTime date, TransactionType transactionType, Double amount, Account originAccountId, Account destinationAccountId) {
        this.transactionId = transactionId;
        this.date = date;
        this.transactionType = transactionType;
        this.amount = amount;
        this.originAccountId = originAccountId;
        this.destinationAccountId = destinationAccountId;
    }
}
