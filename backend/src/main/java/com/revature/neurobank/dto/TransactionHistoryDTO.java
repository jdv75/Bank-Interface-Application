package com.revature.neurobank.dto;

public class TransactionHistoryDTO {

    private String id;
    private String accountId;
    private String type;
    private String category;
    private String name;
    private String detail;
    private double amount;
    private String createdAt;

    public TransactionHistoryDTO() {
    }

    public TransactionHistoryDTO(String id, String accountId, String type, String category,
                                 String name, String detail, double amount, String createdAt) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.category = category;
        this.name = name;
        this.detail = detail;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "TransactionHistoryDTO{" +
                "id='" + id + '\'' +
                ", accountId='" + accountId + '\'' +
                ", type='" + type + '\'' +
                ", category='" + category + '\'' +
                ", name='" + name + '\'' +
                ", detail='" + detail + '\'' +
                ", amount=" + amount +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}
