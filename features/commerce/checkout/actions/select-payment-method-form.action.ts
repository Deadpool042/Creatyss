"use server";

import { revalidatePath } from "next/cache";
import { selectPaymentMethodAction } from "./select-payment-method.action";

export async function selectPaymentMethodFormAction(formData: FormData): Promise<void> {
  const result = await selectPaymentMethodAction(formData);

  if (result.status === "success") {
    revalidatePath("/checkout");
  }
}
