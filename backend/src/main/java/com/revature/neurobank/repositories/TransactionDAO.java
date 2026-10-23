package com.revature.neurobank.repositories;

import com.revature.neurobank.models.Transaction;
import com.revature.neurobank.models.TransactionType;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {

    interface ScheduledOutgoingTotal {
        Integer getAccountId();
        Double getTotal();
    }

    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.originAccountId o
            LEFT JOIN t.destinationAccountId d
            WHERE o.accountId = :accountId
               OR (d.accountId = :accountId
                   AND t.status = com.revature.neurobank.models.TransactionStatus.COMPLETED)
            """)
    Page<Transaction> findHistory(@Param("accountId") Integer accountId, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.originAccountId o
            LEFT JOIN t.destinationAccountId d
            WHERE (o.accountId = :accountId
               OR (d.accountId = :accountId
                   AND t.status = com.revature.neurobank.models.TransactionStatus.COMPLETED))
              AND t.transactionType = :type
            """)
    Page<Transaction> findHistoryByType(@Param("accountId") Integer accountId,
                                        @Param("type") TransactionType type,
                                        Pageable pageable);

    @Query("""
            SELECT o.accountId AS accountId, SUM(t.amount) AS total
            FROM Transaction t
            JOIN t.originAccountId o
            WHERE o.accountId IN :accountIds
              AND t.transactionType = com.revature.neurobank.models.TransactionType.TRANSFER
              AND t.status = com.revature.neurobank.models.TransactionStatus.SCHEDULED
            GROUP BY o.accountId
            """)
    List<ScheduledOutgoingTotal> findScheduledOutgoingTotals(
            @Param("accountIds") Collection<Integer> accountIds);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0.0)
            FROM Transaction t
            WHERE t.originAccountId.accountId = :accountId
              AND t.transactionType = com.revature.neurobank.models.TransactionType.TRANSFER
              AND t.status = com.revature.neurobank.models.TransactionStatus.SCHEDULED
            """)
    Double sumScheduledOutgoingAmount(@Param("accountId") Integer accountId);

    @Query("""
            SELECT t.transactionId
            FROM Transaction t
            WHERE t.transactionType = com.revature.neurobank.models.TransactionType.TRANSFER
              AND t.status = com.revature.neurobank.models.TransactionStatus.SCHEDULED
              AND t.scheduledFor IS NOT NULL
              AND t.scheduledFor <= :currentDate
            ORDER BY t.scheduledFor ASC, t.transactionId ASC
            """)
    List<Integer> findDueScheduledTransferIds(
            @Param("currentDate") LocalDate currentDate,
            Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM Transaction t WHERE t.transactionId = :transactionId")
    Optional<Transaction> findByIdForUpdate(@Param("transactionId") Integer transactionId);

}
