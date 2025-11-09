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
        image={p.imageUrl}
        onAddToCart={() => addToCart(p.id)}
      />
    ))
  ) : (
    <div className="col-span-full text-center text-black italic py-20 text-lg">
  🛒 No products yet!  
    </div>
  
  )}
</div>

  );
}
