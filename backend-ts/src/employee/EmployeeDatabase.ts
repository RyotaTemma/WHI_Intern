import { Employee } from "./Employee";
import { EmployeeFormOptions } from "./EmployeeDatabaseInMemory";

export interface EmployeeDatabase {
    getEmployee(id: string): Promise<Employee | undefined>
    getEmployees(filterText: string): Promise<Employee[]>
    createEmployee(name: string, age: number, affiliation: string, post: string, skills: string[]): Promise<Employee>
    getFormOptions(): Promise<EmployeeFormOptions>
}
