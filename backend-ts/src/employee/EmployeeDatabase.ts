import { Employee } from "./Employee";
import { EmployeeFormOptions } from "./EmployeeDatabaseInMemory";

// フィルターの型定義を追加
export interface EmployeeFilters {
  name?: string;
  affiliation?: string;
  post?: string;
  skill?: string;
}

export interface EmployeeDatabase {
    getEmployee(id: string): Promise<Employee | undefined>
    getEmployees(filters: EmployeeFilters): Promise<Employee[]>
    createEmployee(name: string, age: number, affiliation: string, post: string, skills: string[]): Promise<Employee>
    getFormOptions(): Promise<EmployeeFormOptions>
}
