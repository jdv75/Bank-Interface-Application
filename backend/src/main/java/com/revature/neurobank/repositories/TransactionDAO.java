package com.revature.neurobank.repositories;

import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {

    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.originAccountId o
            LEFT JOIN t.destinationAccountId d
            WHERE o.accountId = :accountId OR d.accountId = :accountId
            """)
    Page<Transaction> findHistory(@Param("accountId") Integer accountId, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.originAccountId o
            LEFT JOIN t.destinationAccountId d
            WHERE (o.accountId = :accountId OR d.accountId = :accountId)
              AND t.transactionType = :type
            """)
    Page<Transaction> findHistoryByType(@Param("accountId") Integer accountId,
                                        @Param("type") TransactionType type,
                                        Pageable pageable);

}
