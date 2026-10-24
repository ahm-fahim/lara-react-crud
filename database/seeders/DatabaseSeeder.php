<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User (admin@admin.com and admin@example.com)
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Additional demo users
        User::factory(5)->create();

        // Demo Employees
        $employees = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'phone' => '+1 555-0101',
                'designation' => 'Senior Software Engineer',
                'salary' => 85000.00,
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '+1 555-0102',
                'designation' => 'Lead UI/UX Designer',
                'salary' => 78000.00,
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'michael.brown@example.com',
                'phone' => '+1 555-0103',
                'designation' => 'DevOps Specialist',
                'salary' => 92000.00,
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Connor',
                'email' => 'sarah.connor@example.com',
                'phone' => '+1 555-0104',
                'designation' => 'Product Manager',
                'salary' => 95000.00,
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Miller',
                'email' => 'david.miller@example.com',
                'phone' => '+1 555-0105',
                'designation' => 'QA Engineer',
                'salary' => 65000.00,
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::updateOrCreate(
                ['email' => $employeeData['email']],
                $employeeData
            );
        }

        // Demo Products
        $products = [
            [
                'name' => 'Apple MacBook Pro 16"',
                'slug' => 'apple-macbook-pro-16',
                'sku' => 'PRD-MBP16',
                'description' => 'M3 Max chip with 16-core CPU, 40-core GPU, 48GB unified memory and 1TB SSD.',
                'price' => 3499.00,
                'sale_price' => 3299.00,
                'status' => 'active',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
            ],
            [
                'name' => 'Sony WH-1000XM5 Wireless Headphones',
                'slug' => 'sony-wh-1000xm5',
                'sku' => 'PRD-SONYXM5',
                'description' => 'Industry-leading noise cancelling with two processors and 8 microphones.',
                'price' => 399.99,
                'sale_price' => 349.99,
                'status' => 'active',
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
            ],
            [
                'name' => 'Mechanical Wireless Keyboard',
                'slug' => 'mechanical-wireless-keyboard',
                'sku' => 'PRD-KBD01',
                'description' => 'Hot-swappable mechanical switches with RGB backlighting and Bluetooth 5.1.',
                'price' => 129.50,
                'sale_price' => null,
                'status' => 'active',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80',
            ],
            [
                'name' => 'Ergonomic Vertical Mouse',
                'slug' => 'ergonomic-vertical-mouse',
                'sku' => 'PRD-MSE02',
                'description' => 'Natural handshake position reduces forearm strain and wrist pressure.',
                'price' => 79.00,
                'sale_price' => 64.99,
                'status' => 'active',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=80',
            ],
            [
                'name' => '4K UltraWide Curved Monitor 34"',
                'slug' => 'ultrawide-curved-monitor-34',
                'sku' => 'PRD-MON34',
                'description' => 'Thunderbolt 4 curved IPS display with 98% DCI-P3 color gamut.',
                'price' => 899.00,
                'sale_price' => null,
                'status' => 'inactive',
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
            ],
        ];

        foreach ($products as $prodData) {
            Product::updateOrCreate(
                ['slug' => $prodData['slug']],
                $prodData
            );
        }
    }
}
