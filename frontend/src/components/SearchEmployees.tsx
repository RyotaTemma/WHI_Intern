"use client";
import { Paper, TextField, SelectChangeEvent } from "@mui/material";
import { useState, useRef } from "react";
import { EmployeeListContainer, EmployeeListContainerRef } from "./EmployeeListContainer";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { AttributeFilter } from "./AttributeFilter";
import { SortKey, SortOrder } from "./SortController";

export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  // フィルター選択値を管理するためのStateを追加
  const [affiliation, setAffiliation] = useState("");
  const [post, setPost] = useState("");
  const [skill, setSkill] = useState("");

    // 並び替えの状態を管理するState
  const [sortKey, setSortKey] = useState<SortKey>(''); // 初期値は「選択なし」
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); // 初期値は「昇順」

  // 並び替えの状態を変更するためのハンドラ関数
  const handleSortKeyChange = (e: SelectChangeEvent<string>) => {
    const newSortKey = e.target.value as SortKey;
    setSortKey(newSortKey);
    // ソートキーがクリアされたら、順序もデフォルト（asc）に戻す（任意）
    if (!newSortKey) {
      setSortOrder('asc');
    }
  };

  const handleSortOrderChange = (e: SelectChangeEvent<string>) => {
    setSortOrder(e.target.value as SortOrder);
  };

  const employeeListRef = useRef<EmployeeListContainerRef>(null);

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
        placeholder="検索キーワードを入力してください"
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
        // AttributeFilter に並び替え用の状態とハンドラを渡す
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortKeyChange={handleSortKeyChange}
        onSortOrderChange={handleSortOrderChange}
      />
      
      <EmployeeListContainer
        key="employeesContainer"
        filters={{
          name: searchKeyword,
          affiliation: affiliation,
          post: post,
          skill: skill,
        }}
        // EmployeeListContainer にもソート情報を渡す
        sort={{
          key: sortKey,
          order: sortOrder,
        }}
        ref={employeeListRef}
      />
    </Paper>
  );
}
