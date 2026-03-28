import { ProductListItem, type ProductListItemData } from "./product-list-item";

type ProductListProps = {
  products: ProductListItemData[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <ul className="divide-y overflow-y-auto">
      {products.map((product) => (
        <li key={product.id}>
          <ProductListItem product={product} />
        </li>
      ))}
    </ul>
  );
}
