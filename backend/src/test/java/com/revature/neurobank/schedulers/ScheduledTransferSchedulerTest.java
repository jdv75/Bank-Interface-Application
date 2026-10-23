package com.revature.neurobank.schedulers;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.neurobank.services.TransactionService;

@ExtendWith(MockitoExtension.class)
class ScheduledTransferSchedulerTest {
    @Mock
    private TransactionService transactionService;

    private ScheduledTransferScheduler scheduler;

    @BeforeEach
    void setUp() {
        scheduler = new ScheduledTransferScheduler(transactionService, 100);
    }

    @Test
    void processDueScheduledTransfersExecutesEveryIdInOrder() {
        when(transactionService.findDueScheduledTransferIds(100))
            .thenReturn(List.of(11, 12, 13));

        scheduler.processDueScheduledTransfers();

        InOrder orderedCalls = inOrder(transactionService);
        orderedCalls.verify(transactionService).findDueScheduledTransferIds(100);
        orderedCalls.verify(transactionService).executeScheduledTransfer(11);
        orderedCalls.verify(transactionService).executeScheduledTransfer(12);
        orderedCalls.verify(transactionService).executeScheduledTransfer(13);
    }

    @Test
    void processDueScheduledTransfersContinuesAfterOneExecutionFails() {
        when(transactionService.findDueScheduledTransferIds(100))
            .thenReturn(List.of(11, 12, 13));
        doAnswer(invocation -> {
            if (invocation.getArgument(0, Integer.class).equals(12)) {
                throw new IllegalStateException("database unavailable");
            }
            return null;
        }).when(transactionService).executeScheduledTransfer(anyInt());

        scheduler.processDueScheduledTransfers();

        verify(transactionService).executeScheduledTransfer(11);
        verify(transactionService).executeScheduledTransfer(12);
        verify(transactionService).executeScheduledTransfer(13);
    }

    @Test
    void processDueScheduledTransfersStopsWhenBatchLookupFails() {
        when(transactionService.findDueScheduledTransferIds(100))
            .thenThrow(new IllegalStateException("database unavailable"));

        scheduler.processDueScheduledTransfers();

        verify(transactionService, never()).executeScheduledTransfer(anyInt());
    }
}
