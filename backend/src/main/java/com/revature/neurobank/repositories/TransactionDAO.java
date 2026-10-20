package com.revature.neurobank.repositories;

import com.revature.neurobank.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // make this class a bean
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {



}
