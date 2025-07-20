import type { LambdaFunctionURLEvent, LambdaFunctionURLResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Employee } from './employee/Employee';
import { EmployeeDatabaseDynamoDB } from './employee/EmployeeDatabaseDynamoDB';
import { EmployeeDatabase, EmployeeFilters } from './employee/EmployeeDatabase';

const getEmployeeHandler = async (database: EmployeeDatabase, id: string): Promise<LambdaFunctionURLResult> => {
    const employee: Employee | undefined = await database.getEmployee(id);
    if (employee == null) {
        console.log("A user is not found.");
        return { statusCode: 404 };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(employee),
    };
};

const getEmployeesHandler = async (database: EmployeeDatabase, filterText: string): Promise<LambdaFunctionURLResult> => {
    const filters: EmployeeFilters = { name: filterText };
    const employees: Employee[] = await database.getEmployees(filters);
    return {
        statusCode: 200,
        body: JSON.stringify(employees),
    };
};

// 選択肢を取得するハンドラー
const getFormOptionsHandler = async (database: EmployeeDatabase): Promise<LambdaFunctionURLResult> => {
    const options = await database.getFormOptions();
    return {
        statusCode: 200,
        body: JSON.stringify(options),
    };
};

const createEmployeeHandler = async (database: EmployeeDatabase, body: string): Promise<LambdaFunctionURLResult> => {
    try {
        const requestData = JSON.parse(body);
        const { name, age, affiliation, post, skills } = requestData;
        
        if (!name || typeof name !== 'string' || !age || typeof age !== 'number') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'name (string) and age (number) are required' }),
            };
        }

        if (!affiliation || typeof affiliation !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'affiliation (string) is required' }),
            };
        }

        if (!post || typeof post !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'post (string) is required' }),
            };
        }

        if (!skills || !Array.isArray(skills) || !skills.every(skill => typeof skill === 'string')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'skills (array of strings) is required' }),
            };
        }
        
        const newEmployee = await database.createEmployee(name, age, affiliation, post, skills);
        return {
            statusCode: 201,
            body: JSON.stringify(newEmployee),
        };
    } catch (error) {
        console.error('Error creating employee:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' }),
        };
    }
};

export const handle = async (event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> => {
    console.log('event', event);
    try {
        const tableName = process.env.EMPLOYEE_TABLE_NAME;
        if (tableName == null) {
            throw new Error("The environment variable EMPLOYEE_TABLE_NAME is not specified.");
        }
        const client = new DynamoDBClient();
        const database = new EmployeeDatabaseDynamoDB(client, tableName);
        // https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/urls-invocation.html
        const path = normalizePath(event.requestContext.http.path);
        const method = event.requestContext.http.method;
        const query = event.queryStringParameters;
        
        // POSTとGETの分岐によるハンドラーの呼び出し
        if (path === "/api/employees") {
            if (method === "GET") {
                return getEmployeesHandler(database, query?.filterText ?? "");
            } else if (method === "POST") {
                return createEmployeeHandler(database, event.body ?? "");
            } else {
                return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
            }
        } else if (path === "/api/form-options") {
            if (method === "GET") {
                return getFormOptionsHandler(database);
            } else {
                return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
            }
        } else if (path.startsWith("/api/employees/")) {
            const id = path.substring("/api/employees/".length);
            if (method === "GET") {
                return getEmployeeHandler(database, id);
            } else {
                return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
            }
        } else {
            console.log("Invalid path", path);
            return { statusCode: 400 };
        }
    } catch (e) {
        console.error('Internal Server Error', e);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
            }),
        };
    }
};

function normalizePath(path: string): string {
    return path.endsWith("/") ? path.slice(0, -1) : path;
}