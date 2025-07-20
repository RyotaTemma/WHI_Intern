import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";

// getEmployeesの引数の型を定義
interface EmployeeFilters {
  name?: string;
  affiliation?: string;
  post?: string;
  skill?: string;
}

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
    private employees: Map<string, Employee>

    constructor() {
        this.employees = new Map<string, Employee>();
        this.employees.set("1", { id: "1", name: "Jane Doe", age: 22, affiliation: "Engineering", post: "Software Engineer", skills: ["JavaScript", "TypeScript"] });
        this.employees.set("2", { id: "2", name: "John Smith", age: 28, affiliation: "Design", post: "Graphic Designer", skills: ["Illustrator", "Print Design"] });
        this.employees.set("3", { id: "3", name: "山田 太郎", age: 27, affiliation: "Marketing", post: "Marketing Manager", skills: ["Sales Strategy", "User Research"] });
    }

    async getEmployee(id: string): Promise<Employee | undefined> {
        return this.employees.get(id);
    }

    async getEmployees(filters: EmployeeFilters): Promise<Employee[]> {
        let filteredEmployees = Array.from(this.employees.values());

        // 名前での絞り込み
        if (filters.name) {
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }
        // 所属での絞り込み
        if (filters.affiliation) {
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.affiliation === filters.affiliation
            );
        }
        // 役職での絞り込み
        if (filters.post) {
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.post === filters.post
            );
        }
        // スキルでの絞り込み
        if (filters.skill) {
            filteredEmployees = filteredEmployees.filter(employee =>
                employee.skills.includes(filters.skill!)
            );
        }

        return filteredEmployees;
    }

    async createEmployee(name: string, age: number, affiliation: string, post: string, skills: string[]): Promise<Employee> {
        // 1) 既存 ID 群を取り出し、数値化
        const existingIds = Array.from(this.employees.keys())
            .map(id => parseInt(id))
            .filter(id => !isNaN(id));
    
        // 2) 最大 ID を見つけ、+1 した値を新しい ID とする（要素が無ければ 1）
        const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
        // 3) 引数 name, age, affiliation, post, skills から Employee オブジェクトを構築
        const newEmployee: Employee = {
            id: nextId.toString(),
            name: name,
            age: age,
            affiliation: affiliation,
            post: post,
            skills: skills
        };
    
        // 4) マップに登録
        this.employees.set(newEmployee.id, newEmployee);
    
        // 5) 生成した Employee を返す（Promise<Employee>)
        return newEmployee;
    }
}
