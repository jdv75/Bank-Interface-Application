package com.revature.neurobank.repositories;

import java.util.*;
import com.revature.neurobank.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountDAO extends JpaRepository<Account, Integer> {

    List<Account> findByUsername_Username(String username);

    Optional<Account> findByAccountIdAndUsername_Username(Integer accountId, String username);

}
