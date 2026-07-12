'use client';

import Link from 'next/link';
import { ArrowRight, Percent, Banknote } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  commission_type: 'fixed' | 'percentage';
  commission_value: number;
  image_color: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const commission = product.commission_type === 'fixed' 
    ? `${product.commission_value.toLocaleString('fr-FR')} FCFA`
    : `${product.commission_value}%`;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card product-card cursor-pointer h-full flex flex-col">
        <div 
          className="h-48 rounded-xl mb-4 flex items-center justify-center"
          style={{ backgroundColor: product.image_color }}
        >
          <div className="text-white text-6xl font-bold opacity-50">
            {product.name.charAt(0)}
          </div>
        </div>

        <span className="inline-block px-3 py-1 bg-secondary text-primary text-xs font-semibold rounded-full mb-2 w-fit">
          {product.category}
        </span>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>

        <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {product.commission_type === 'fixed' ? (
              <Banknote className="w-5 h-5 text-accent" />
            ) : (
              <Percent className="w-5 h-5 text-accent" />
            )}
            <span className="font-display font-bold text-accent text-lg">
              {commission}
            </span>
            <span className="text-gray-500 text-xs">
              {product.commission_type === 'fixed' ? 'commission' : 'du prix'}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {product.price.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-48 rounded-xl mb-4" />
      <div className="skeleton h-6 w-20 rounded-full mb-2" />
      <div className="skeleton h-6 w-3/4 rounded mb-2" />
      <div className="skeleton h-4 w-full rounded mb-4" />
      <div className="skeleton h-4 w-1/2 rounded mb-4" />
      <div className="skeleton h-12 rounded border-t" />
    </div>
  );
}
