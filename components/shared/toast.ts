"use client";

import { toast as sonnerToast } from "sonner";

// Single shared toast primitive.
// Rationale: avoid ad hoc imports from "sonner" across the repo.
export const toast = sonnerToast;

