"use client";
import { Paper, TextField } from "@mui/material";
import { useState, useRef } from "react";
import { EmployeeListContainer, EmployeeListContainerRef } from "./EmployeeListContainer";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { Employee } from "../models/Employee";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const employeeListRef = useRef<EmployeeListContainerRef>(null);

  const handleEmployeeAdded = (employee: Employee) => {
    // Refresh the employee list after adding a new employee
    if (employeeListRef.current) {
      employeeListRef.current.refresh();
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
        p: 2,
      }}
    >
      <AddEmployeeForm onEmployeeAdded={handleEmployeeAdded} />
      
      <TextField
        placeholder="検索キーワードを入力してください"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <EmployeeListContainer
        key="employeesContainer"
        filterText={searchKeyword}
        ref={employeeListRef}
      />
    </Paper>
  );
}
