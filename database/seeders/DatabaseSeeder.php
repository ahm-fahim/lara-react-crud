<?php

namespace Database\Seeders;

use App\Models\Employee;
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
    }
}
