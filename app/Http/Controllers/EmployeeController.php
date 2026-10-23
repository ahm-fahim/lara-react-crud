<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Employees/Index', [
            'employees' => Employee::latest()->get(),
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        Employee::create($request->validated());

        return redirect()->back();
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update(array_filter($request->validated()));

        return redirect()->back();
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->back();
    }
}
