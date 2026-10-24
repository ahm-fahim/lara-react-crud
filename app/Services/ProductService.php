<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * Retrieve all products ordered by latest.
     *
     * @return Collection<int, Product>
     */
    public function getAll(): Collection
    {
        return Product::latest()->get();
    }

    /**
     * Create a new product.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Product
    {
        // Generate slug from name if not manually provided
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        // Auto-generate SKU if blank
        if (empty($data['sku']) && ! empty($data['name'])) {
            $data['sku'] = 'PRD-'.strtoupper(Str::random(6));
        }

        $data['featured'] = ! empty($data['featured']);
        $data['status'] = $data['status'] ?? 'active';

        return Product::create($data);
    }

    /**
     * Update an existing product.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Product $product, array $data): Product
    {
        if (empty($data['slug']) && ! empty($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->generateUniqueSlug($data['name'], $product->id);
        }

        if (isset($data['featured'])) {
            $data['featured'] = (bool) $data['featured'];
        }

        $product->update($data);

        return $product;
    }

    /**
     * Delete a product.
     */
    public function delete(Product $product): bool
    {
        return (bool) $product->delete();
    }

    /**
     * Generate a unique slug for a product.
     */
    protected function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
