"use server";

import { revalidatePath } from "next/cache";
import { selectShippingMethodAction } from "./select-shipping-method.action";

export async function selectShippingMethodFormAction(formData: FormData): Promise<void> {
  const result = await selectShippingMethodAction(formData);

  if (result.status === "success") {
    revalidatePath("/checkout");
  }
}
