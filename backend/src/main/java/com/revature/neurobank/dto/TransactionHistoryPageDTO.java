package com.revature.neurobank.dto;

import java.util.List;

public class TransactionHistoryPageDTO {

    private List<TransactionHistoryDTO> transactions;
    private long total;


    public TransactionHistoryPageDTO() {
    }

    public TransactionHistoryPageDTO(List<TransactionHistoryDTO> transactions, long total) {
        this.transactions = transactions;
        this.total = total;
    }

    public List<TransactionHistoryDTO> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionHistoryDTO> transactions) {
        this.transactions = transactions;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "TransactionHistoryPageDTO{" +
                "transactions=" + transactions +
                ", total=" + total +
                '}';
    }
}
