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
    private TransactionType transactionType;

    @Column 
    private Double amount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accountId")
    private Account originAccountId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accountId")
    private Account destinationAccountId;



    // SETTERS...
    
}
