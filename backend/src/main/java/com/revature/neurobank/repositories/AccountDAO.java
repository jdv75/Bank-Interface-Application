package com.revature.neurobank.repositories;

import java.util.*;
import com.revature.neurobank.models.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountDAO extends JpaRepository<Account, Integer> {

    List<Account> findByUsername_Username(String username);

    Optional<Account> findByAccountIdAndUsername_Username(Integer accountId, String username);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.accountId = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Integer id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select a from Account a
        where a.accountId = :sourceAccountId
           or (a.accountId = :destinationAccountId
               and a.bankRoutingNum.routingNumber = :routingNumber)
        order by a.accountId
        """)
    List<Account> findExternalTransferAccountsForUpdate(
        @Param("sourceAccountId") Integer sourceAccountId,
        @Param("destinationAccountId") Integer destinationAccountId,
        @Param("routingNumber") Integer routingNumber
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select a from Account a
        where a.accountId in :accountIds
        order by a.accountId
        """)
    List<Account> findAllByAccountIdInForUpdate(
        @Param("accountIds") Collection<Integer> accountIds
    );
}
