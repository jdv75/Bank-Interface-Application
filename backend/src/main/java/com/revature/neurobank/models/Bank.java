package com.revature.neurobank.models;
import jakarta.persistence.*;

@Entity
@Table(name = "bank")
public class Bank {

    @Id 
    private Integer routingNumber;

    @Column 
    private String bankName;
}
