import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from './employee/EmployeeDatabaseInMemory';

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

// JSON解析のためのmiddleware
app.use(express.json());

app.get("/api/employees", async (req: Request, res: Response) => {
    // クエリから各フィルターパラメータを取得
    const { name, affiliation, post, skill } = req.query;

    // 各パラメータが配列でないことを確認
    if (Array.isArray(name) || Array.isArray(affiliation) || Array.isArray(post) || Array.isArray(skill)) {
        res.status(400).json({ error: "Filter parameters must not be arrays." });
        return;
    }

    try {
        // データベースに渡すためのfiltersオブジェクトを構築
        const filters = {
            name: typeof name === 'string' ? name : undefined,
            affiliation: typeof affiliation === 'string' ? affiliation : undefined,
            post: typeof post === 'string' ? post : undefined,
            skill: typeof skill === 'string' ? skill : undefined,
        };

        // 新しいgetEmployeesメソッドを呼び出し
        const employees = await database.getEmployees(filters);

        // res.json() を使って結果を返す
        res.status(200).json(employees);
    } catch (e) {
        console.error(`Failed to load employees with filters.`, e);
        res.status(500).send();
    }
});

app.post("/api/employees", async (req: Request, res: Response) => {
    try {
        const { name, age, affiliation, post, skills } = req.body;
        
        if (!name || typeof name !== 'string' || !age || typeof age !== 'number') {
            res.status(400).send(JSON.stringify({ error: 'name (string) and age (number) are required' }));
            return;
        }
        
        const newEmployee = await database.createEmployee(name, age, affiliation, post, skills);
        res.status(201).send(JSON.stringify(newEmployee));
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).send(JSON.stringify({ error: 'Invalid request body' }));
    }
});

app.get("/api/employees/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const employee = await database.getEmployee(userId);
        if (employee == undefined) {
            res.status(404).send();
            return;
        }
        res.status(200).send(JSON.stringify(employee));
    } catch (e) {
        console.error(`Failed to load the user ${userId}.`, e);
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`App listening on the port ${port}`);
});
