"use client";
import { Paper, TextField, SelectChangeEvent } from "@mui/material";
import { useState, useRef } from "react";
import { EmployeeListContainer, EmployeeListContainerRef } from "./EmployeeListContainer";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { AttributeFilter } from "./AttributeFilter";
import { useTranslations } from '../hooks/useTranslations';

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  // フィルター選択値を管理するためのStateを追加
  const [affiliation, setAffiliation] = useState("");
  const [post, setPost] = useState("");
  const [skill, setSkill] = useState("");

  const employeeListRef = useRef<EmployeeListContainerRef>(null);
  const t = useTranslations('employee');

  const handleEmployeeAdded = () => {
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
        placeholder={t('search')}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
            
      <AttributeFilter 
        affiliation={affiliation}
        post={post}
        skill={skill}
        onAffiliationChange={(e: SelectChangeEvent<string>) => setAffiliation(e.target.value)}
        onPostChange={(e: SelectChangeEvent<string>) => setPost(e.target.value)}
        onSkillChange={(e: SelectChangeEvent<string>) => setSkill(e.target.value)}
      />
      
      <EmployeeListContainer
        key="employeesContainer"
        filters={{
          name: searchKeyword,
          affiliation: affiliation,
          post: post,
          skill: skill,
        }}
        ref={employeeListRef}
      />
    </Paper>
  );
}
