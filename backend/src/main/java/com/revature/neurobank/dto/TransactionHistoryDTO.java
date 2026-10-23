package com.revature.neurobank.dto;

import java.time.LocalDate;

import com.revature.neurobank.models.TransactionStatus;

public class TransactionHistoryDTO {

    private String id;
    private String accountId;
    private String type;
    private String category;
    private String name;
    private String detail;
    private double amount;
    private String createdAt;
    private TransactionStatus status;
    private String note;
    private LocalDate scheduledFor;

    public TransactionHistoryDTO() {
    }

    public TransactionHistoryDTO(String id, String accountId, String type, String category,
                                 String name, String detail, double amount, String createdAt,
                                 TransactionStatus status, String note, LocalDate scheduledFor) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.category = category;
        this.name = name;
        this.detail = detail;
        this.amount = amount;
        this.createdAt = createdAt;
        this.status = status;
        this.note = note;
        this.scheduledFor = scheduledFor;
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

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getScheduledFor() {
        return scheduledFor;
    }

    public void setScheduledFor(LocalDate scheduledFor) {
        this.scheduledFor = scheduledFor;
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
                ", status=" + status +
                ", note='" + note + '\'' +
                ", scheduledFor=" + scheduledFor +
                '}';
    }
}
