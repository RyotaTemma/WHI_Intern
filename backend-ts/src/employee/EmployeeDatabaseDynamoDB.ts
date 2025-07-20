import { DynamoDBClient, GetItemCommand, GetItemCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { isLeft } from "fp-ts/Either";
import { EmployeeDatabase, EmployeeFilters } from "./EmployeeDatabase";
import { Employee, EmployeeT } from "./Employee";
import { EmployeeFormOptions } from "./EmployeeDatabaseInMemory";

export class EmployeeDatabaseDynamoDB implements EmployeeDatabase {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(client: DynamoDBClient, tableName: string) {
        this.client = client;
        this.tableName = tableName;
    }

    async getEmployee(id: string): Promise<Employee | undefined> {
        const input: GetItemCommandInput  = {
            TableName: this.tableName,
            Key: {
                id: { S: id },
            },
        };
        const output = await this.client.send(new GetItemCommand(input));
        const item = output.Item;
        if (item == null) {
            return;
        }
        const employee = {
            id: id,
            name: item["name"].S,
            age: mapNullable(item["age"].N, value => parseInt(value, 10)),
        };
        const decoded = EmployeeT.decode(employee);
        if (isLeft(decoded)) {
            throw new Error(`Employee ${id} is missing some fields. ${JSON.stringify(employee)}`);
        } else {
            return decoded.right;
        }
    }

    async getEmployees(filters: EmployeeFilters): Promise<Employee[]> {
        const input: ScanCommandInput  = {
            TableName: this.tableName,
        };
        const output = await this.client.send(new ScanCommand(input));
        const items = output.Items;
        if (items == null) {
            return [];
        }
        return items
            .filter(item => {
                // 名前フィルタリング（後方互換性のため）
                if (filters.name && filters.name !== "") {
                    return item["name"].S?.toLowerCase().includes(filters.name.toLowerCase());
                }
                return true;
            })
            .map(item => {
                return {
                    id: item["id"].S,
                    name: item["name"].S,
                    age: mapNullable(item["age"].N, value => parseInt(value, 10)),
                }
            }).flatMap(employee => {
                const decoded = EmployeeT.decode(employee);
                if (isLeft(decoded)) {
                    console.error(`Employee ${employee.id} is missing some fields and skipped. ${JSON.stringify(employee)}`);
                    return [];
                } else {
                    return [decoded.right];
                }
            });
    }

    async createEmployee(name: string, age: number, affiliation: string, post: string, skills: string[]): Promise<Employee> {
        // 未実装のため、エラーを投げる
        throw new Error("DynamoDB implementation not available yet. Please use EmployeeDatabaseInMemory for now.");
    }

    async getFormOptions(): Promise<EmployeeFormOptions> {
        // DynamoDBでは未実装のため、InMemoryと同じ選択肢を返す
        return {
            affiliations: [
                "Engineering",
                "Marketing", 
                "Sales",
                "Design",
                "HR",
                "Finance",
                "Operations",
                "Legal",
                "Customer Support"
            ],
            posts: [
                "Software Engineer",
                "Senior Software Engineer", 
                "Tech Lead",
                "Engineering Manager",
                "DevOps Engineer",
                "Marketing Manager",
                "Marketing Specialist",
                "Sales Manager",
                "Sales Representative",
                "UI/UX Designer",
                "Graphic Designer",
                "Product Designer",
                "HR Specialist",
                "HR Manager",
                "Financial Analyst",
                "Accountant",
                "Operations Manager",
                "Legal Counsel",
                "Customer Support Specialist"
            ],
            skills: [
                "JavaScript",
                "TypeScript", 
                "React",
                "Node.js",
                "Python",
                "Java",
                "AWS",
                "Docker",
                "Kubernetes",
                "Git",
                "SQL",
                "MongoDB",
                "Figma",
                "Photoshop",
                "Illustrator",
                "Digital Marketing",
                "SEO",
                "Analytics",
                "Sales Strategy",
                "CRM",
                "Negotiation",
                "Project Management",
                "Agile",
                "Scrum",
                "User Research",
                "Data Analysis",
                "Excel",
                "PowerPoint",
                "Communication",
                "Leadership",
                "Problem Solving"
            ]
        };
    }
}

function mapNullable<T, U>(value: T | null | undefined, mapper: (value: T) => U): U | undefined {
    if (value != null) {
        return mapper(value);
    }
}
