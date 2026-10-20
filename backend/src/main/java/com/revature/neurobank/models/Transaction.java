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



    // SETTERS...


    public Transaction() {
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
