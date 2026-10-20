package com.revature.neurobank.models;
import jakarta.persistence.*;

@Entity
@Table(name = "bank")
public class Bank {

    @Id 
    private Integer routingNumber;

    @Column 
    private String bankName;

    public Integer getRoutingNumber() {
        return routingNumber;
    }

    public void setRoutingNumber(Integer routingNumber) {
        this.routingNumber = routingNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    
}
