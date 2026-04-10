"use server";

import {
  uploadProductImagesFormInitialState,
  type UploadProductImagesFormState,
} from "../types";

export async function uploadProductImagesAction(
  _prevState: UploadProductImagesFormState,
  _formData: FormData
): Promise<UploadProductImagesFormState> {
  return {
    ...uploadProductImagesFormInitialState,
    status: "success",
    message: "Import effectué.",
  };
}
