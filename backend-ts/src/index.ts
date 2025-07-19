import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from './employee/EmployeeDatabaseInMemory';

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

// JSON解析のためのmiddleware
app.use(express.json());

app.get("/api/employees", async (req: Request, res: Response) => {
    const filterText = req.query.filterText ?? "";
    // req.query is parsed by the qs module.
    // https://www.npmjs.com/package/qs
    if (Array.isArray(filterText)) {
        // Multiple filterText is not supported
        res.status(400).send();
        return;
    }
    if (typeof filterText !== "string") {
        // Nested query object is not supported
        res.status(400).send();
        return;
    }
    try {
        const employees = await database.getEmployees(filterText);
        res.status(200).send(JSON.stringify(employees));
    } catch (e) {
        console.error(`Failed to load the users filtered by ${filterText}.`, e);
        res.status(500).send();
    }
});

app.post("/api/employees", async (req: Request, res: Response) => {
    try {
        const { name, age } = req.body;
        
        if (!name || typeof name !== 'string' || !age || typeof age !== 'number') {
            res.status(400).send(JSON.stringify({ error: 'name (string) and age (number) are required' }));
            return;
        }
        
        const newEmployee = await database.createEmployee(name, age);
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
