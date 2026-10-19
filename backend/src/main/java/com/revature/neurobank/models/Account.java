package com.revature.neurobank.models;
import jakarta.persistence.*;


@Entity
@Table(name = "accounts")
public class Account {
    
    @Id
    @Column
    @SequenceGenerator(
        name = "account_sequence",
        sequenceName = "user_sequence",
        initialValue = 100000000,   // Sequence starts at 100000000
        allocationSize = 5  // Increments by 5 for performance batching
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_sequence")
    private Integer accountId;

    @Column 
    private Integer pin;

    @Column 
    private Double balance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private User username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "routingNum")
    private Bank bankRoutingNum;

    @Column
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

}

