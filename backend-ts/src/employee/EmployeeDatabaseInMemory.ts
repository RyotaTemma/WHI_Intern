import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
    private employees: Map<string, Employee>

    constructor() {
        this.employees = new Map<string, Employee>();
        this.employees.set("1", { id: "1", name: "Jane Doe", age: 22, affiliation: "Engineering", post: "Software Engineer", skills: ["JavaScript", "TypeScript"] });
        this.employees.set("2", { id: "2", name: "John Smith", age: 28, affiliation: "Engineering", post: "Software Engineer", skills: ["JavaScript", "TypeScript"] });
        this.employees.set("3", { id: "3", name: "山田 太郎", age: 27, affiliation: "Engineering", post: "Software Engineer", skills: ["JavaScript", "TypeScript"] });
    }

    async getEmployee(id: string): Promise<Employee | undefined> {
        return this.employees.get(id);
    }

    async getEmployees(filterText: string): Promise<Employee[]> {
        const employees = Array.from(this.employees.values());
        if (filterText === "") {
            return employees;
        }
        return employees.filter(employee =>
            employee.name.toLowerCase().includes(filterText.toLowerCase())
        );
    }

    async createEmployee(name: string, age: number): Promise<Employee> {
        // 1) 既存 ID 群を取り出し、数値化
        const existingIds = Array.from(this.employees.keys())
            .map(id => parseInt(id))
            .filter(id => !isNaN(id));
    
        // 2) 最大 ID を見つけ、+1 した値を新しい ID とする（要素が無ければ 1）
        const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
        // 3) 引数 name, age から Employee オブジェクトを構築
        const newEmployee: Employee = {
            id: nextId.toString(),
            name: name,
            age: age,
            affiliation: "Engineering",
            post: "Software Engineer",
            skills: ["JavaScript", "TypeScript"]
        };
    
        // 4) マップに登録
        this.employees.set(newEmployee.id, newEmployee);
    
        // 5) 生成した Employee を返す（Promise<Employee>)
        return newEmployee;
    }
}
