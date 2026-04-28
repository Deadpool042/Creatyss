import { withTransaction, type DbExecutor } from "@/core/db";
import { AdminProductEditorServiceError } from "./shared/error";

type ProductTypeScope = {
  productTypeId: string;
};

async function assertProductTypeScope(
  executor: DbExecutor,
  productId: string
): Promise<ProductTypeScope> {
  const product = await executor.product.findFirst({
    where: {
      id: productId,
      archivedAt: null,
    },
    select: {
      productTypeId: true,
    },
  });

  if (!product?.productTypeId) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  return {
    productTypeId: product.productTypeId,
  };
}

function normalizeLabelToValue(label: string): string {
  return label.trim();
}

function normalizeLabelToCode(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

type UpdateProductOptionColorHexServiceInput = {
  productId: string;
  optionValueId: string;
  label: string;
  colorHex: string | null;
};

export async function updateProductOptionColorHex(
  input: UpdateProductOptionColorHexServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const optionValue = await tx.productOptionValue.findFirst({
      where: {
        id: input.optionValueId,
        archivedAt: null,
        isActive: true,
        option: {
          productTypeId,
          isVariantAxis: true,
          isActive: true,
          archivedAt: null,
        },
      },
      select: {
        id: true,
        optionId: true,
      },
    });

    if (optionValue === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const label = input.label.trim();
    if (label.length === 0) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const labelValue = normalizeLabelToValue(label);
    const conflict = await tx.productOptionValue.findFirst({
      where: {
        optionId: optionValue.optionId,
        id: {
          not: optionValue.id,
        },
        archivedAt: null,
        isActive: true,
        OR: [{ value: labelValue }, { label: labelValue }],
      },
      select: {
        id: true,
      },
    });

    if (conflict !== null) {
      throw new AdminProductEditorServiceError("option_value_label_taken");
    }

    await tx.productOptionValue.update({
      where: { id: optionValue.id },
      data: {
        value: labelValue,
        label: labelValue,
        colorHex: input.colorHex,
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: optionValue.id,
    };
  });
}

type CreateProductOptionColorValueServiceInput = {
  productId: string;
  optionId: string;
  label: string;
  colorHex: string | null;
};

export async function createProductOptionColorValue(
  input: CreateProductOptionColorValueServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const option = await tx.productOption.findFirst({
      where: {
        id: input.optionId,
        productTypeId,
        isVariantAxis: true,
        isActive: true,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (option === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const label = input.label.trim();
    if (label.length === 0) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const value = normalizeLabelToValue(label);
    const existingLabel = await tx.productOptionValue.findFirst({
      where: {
        optionId: option.id,
        archivedAt: null,
        isActive: true,
        OR: [{ value }, { label: value }],
      },
      select: {
        id: true,
      },
    });

    if (existingLabel !== null) {
      throw new AdminProductEditorServiceError("option_value_label_taken");
    }

    const baseCode = normalizeLabelToCode(label) || "color";
    let code = baseCode;
    let attempt = 1;
    while (true) {
      const existingCode = await tx.productOptionValue.findFirst({
        where: {
          optionId: option.id,
          code,
        },
        select: {
          id: true,
        },
      });
      if (existingCode === null) {
        break;
      }
      attempt += 1;
      code = `${baseCode}-${attempt}`;
    }

    const created = await tx.productOptionValue.create({
      data: {
        optionId: option.id,
        code,
        value,
        label: value,
        colorHex: input.colorHex,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: created.id,
    };
  });
}

type ArchiveProductOptionColorValueServiceInput = {
  productId: string;
  optionValueId: string;
};

export async function archiveProductOptionColorValue(
  input: ArchiveProductOptionColorValueServiceInput
): Promise<{ optionValueId: string }> {
  return withTransaction(async (tx) => {
    const { productTypeId } = await assertProductTypeScope(tx, input.productId);

    const optionValue = await tx.productOptionValue.findFirst({
      where: {
        id: input.optionValueId,
        archivedAt: null,
        isActive: true,
        option: {
          productTypeId,
          isVariantAxis: true,
          isActive: true,
          archivedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (optionValue === null) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }

    const linksCount = await tx.productVariantOptionValue.count({
      where: {
        optionValueId: optionValue.id,
        variant: {
          archivedAt: null,
        },
      },
    });

    if (linksCount > 0) {
      throw new AdminProductEditorServiceError("option_value_in_use");
    }

    await tx.productOptionValue.update({
      where: { id: optionValue.id },
      data: {
        isActive: false,
        archivedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return {
      optionValueId: optionValue.id,
    };
  });
}
