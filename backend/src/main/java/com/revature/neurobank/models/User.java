package com.revature.neurobank.models;
import jakarta.persistence.*;


@Entity 
@Table(name="users")
public class User {

    @Id
    @Column 
     private String username;

    @Column 
     private String password;

    @Column 
    private String fName;

    @Column 
    private String lName;

    @Column 
    private String email;

    @Column 
     private String phone;
    
}
