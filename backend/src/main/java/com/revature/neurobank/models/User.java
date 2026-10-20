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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

     
    
}
