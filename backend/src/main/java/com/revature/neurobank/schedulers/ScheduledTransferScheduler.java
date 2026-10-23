package com.revature.neurobank.schedulers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.revature.neurobank.services.TransactionService;

@Component
@ConditionalOnProperty(
    name = "app.scheduled-transfers.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class ScheduledTransferScheduler {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTransferScheduler.class);

    private final TransactionService transactionService;
    private final int batchSize;

    public ScheduledTransferScheduler(
        TransactionService transactionService,
        @Value("${app.scheduled-transfers.batch-size:100}") int batchSize
    ) {
        this.transactionService = transactionService;
        this.batchSize = batchSize;
    }

    @Scheduled(
        fixedDelayString = "${app.scheduled-transfers.interval-ms:60000}",
        initialDelayString = "${app.scheduled-transfers.interval-ms:60000}"
    )
    public void processDueScheduledTransfers() {
        List<Integer> transactionIds;

        try {
            transactionIds = this.transactionService.findDueScheduledTransferIds(batchSize);
        } catch (RuntimeException e) {
            logger.error("Unable to retrieve due scheduled transfers.", e);
            return;
        }

        for (Integer transactionId : transactionIds) {
            try {
                this.transactionService.executeScheduledTransfer(transactionId);
                logger.info("Finished processing or skipping scheduled transfer {}.", transactionId);
            } catch (RuntimeException e) {
                logger.error(
                    "Scheduled transfer {} could not be processed and will be retried.",
                    transactionId,
                    e
                );
            }
        }
    }
}
