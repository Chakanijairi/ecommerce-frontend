import React from "react";
import ProductCard from "./ProductCard";
import { products as defaultProducts } from "../data/products.js";

export default function ProductList({ addToCart, products = defaultProducts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {products.length > 0 ? (
    products.map((p) => (
      <ProductCard
        key={p.id}
        name={p.name}
        price={p.price}
        description={p.description}
        image={p.image}
        onAddToCart={() => addToCart(p.id)}
      />
    ))
  ) : (
    <div className="col-span-full text-center text-white italic py-20 text-lg">
  🛒 No products yet!  add some from the edit page!
    </div>
  
  )}
</div>

  );
}
