"use client";

import { useEffect, useState } from "react";

type UseProductTableFeedbackResult = {
  bulkMessage: string | null;
  bulkError: string | null;
  setBulkMessage: (value: string | null) => void;
  setBulkError: (value: string | null) => void;
};

/**
 * Manages the transient feedback state (success message / error message)
 * displayed after bulk or single-item actions in the product table.
 *
 * Auto-clears both values after 3.5 s whenever either is non-null.
 */
export function useProductTableFeedback(): UseProductTableFeedbackResult {
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  useEffect(() => {
    if (bulkMessage === null && bulkError === null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setBulkMessage(null);
      setBulkError(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [bulkMessage, bulkError]);

  return { bulkMessage, bulkError, setBulkMessage, setBulkError };
}
