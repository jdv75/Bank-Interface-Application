package com.revature.neurobank.models;
import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    
    @Id
    @Column
    @SequenceGenerator(
        name = "account_sequence",
        sequenceName = "account_sequence",
        initialValue = 100000000,   // Sequence starts at 100000000
        allocationSize = 5  // Increments by 5 for performance batching
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_sequence")
    private Integer accountId;

    @Column 
    private String pin;

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

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public User getUsername() {
        return username;
    }

    public void setUsername(User username) {
        this.username = username;
    }

    public Bank getBankRoutingNum() {
        return bankRoutingNum;
    }

    public void setBankRoutingNum(Bank bankRoutingNum) {
        this.bankRoutingNum = bankRoutingNum;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

}

