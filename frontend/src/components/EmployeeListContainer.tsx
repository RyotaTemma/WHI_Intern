"use client";

import { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeListItem } from "./EmployeeListItem";
import { Employee, EmployeeT } from "../models/Employee";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { SortKey, SortOrder } from "./SortController";

import { Box, IconButton, Tooltip, Stack, Divider, Grid } from "@mui/material";

// フィルターの型を定義
export interface EmployeeFilters {
  name?: string;
  affiliation?: string;
  post?: string;
  skill?: string;
}

// propsの型定義に`sort`を追加
export type EmployeesContainerProps = {
  filters: EmployeeFilters;
  sort: {
    key: SortKey;
    order: SortOrder;
  };
};

export type EmployeeListContainerRef = {
  refresh: () => void;
};

const EmployeesT = t.array(EmployeeT);

const employeesFetcher = async (url: string): Promise<Employee[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees at ${url}`);
  }
  const body = await response.json();
  const decoded = EmployeesT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

export const EmployeeListContainer = forwardRef<EmployeeListContainerRef, EmployeesContainerProps>(
  // ▼▼▼ 変更・追加点 ▼▼▼
  // sortをpropsとして受け取る
  ({ filters, sort }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getInitialViewMode = (): "list" | "card" => {
      const view = searchParams.get("view");
      return view === "card" ? "card" : "list";
    };

    const [viewMode, setViewMode] = useState<"list" | "card">(getInitialViewMode);

    const swrKey = (() => {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.affiliation) params.append('affiliation', filters.affiliation);
      if (filters.post) params.append('post', filters.post);
      if (filters.skill) params.append('skill', filters.skill);
      return `/api/employees?${params.toString()}`;
    })();

    const { data, error, isLoading, mutate } = useSWR<Employee[], Error>(
      swrKey,
      employeesFetcher
    );

    // ▼▼▼ 変更・追加点 ▼▼▼
    // useMemoを使ってソート済みのデータを作成
    const sortedData = useMemo(() => {
      // SWRからデータがまだ返ってきていない場合は空配列を返す
      if (!data) {
        return [];
      }

      // sort.keyが空文字（falsy）の場合、並び替えせずに元のデータを返す
      // これが型ガードとして機能し、以降の処理でsort.keyが有効なキーであることをTypeScriptに伝える
      if (!sort.key) {
        return data;
      }

      type ValidSortKey = Exclude<SortKey, ''>; // '' を除いた正当なキー型
      const key = sort.key as ValidSortKey;     // 明示的にキャスト

      // 元のdata配列を直接変更しないようにコピーを作成
      const sortableData = [...data];

      sortableData.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          // skills（配列）の場合でも、先頭の要素で文字列比較を行う
          const strA = Array.isArray(valA) ? (valA[0] || '') : String(valA);
          const strB = Array.isArray(valB) ? (valB[0] || '') : String(valB);
          comparison = strA.localeCompare(strB, 'ja');
        }

        return sort.order === 'desc' ? comparison * -1 : comparison;
      });
      
      return sortableData;
    }, [data, sort.key, sort.order]);// dataかソート条件が変わった時だけ再計算

    const handleViewModeChange = (mode: "list" | "card") => {
      setViewMode(mode);
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", mode);
      router.replace(`${pathname}?${params.toString()}`);
    };

    useImperativeHandle(ref, () => ({
      refresh: () => {
        mutate();
      },
    }));

    useEffect(() => {
      if (error != null) {
        console.error(`Failed to fetch employees`, error);
      }
    }, [error]);

    const ViewModeToggle = () => (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Tooltip title="リスト表示">
            <IconButton
              color={viewMode === "list" ? "primary" : "default"}
              onClick={() => handleViewModeChange("list")}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="カード表示">
            <IconButton
              color={viewMode === "card" ? "primary" : "default"}
              onClick={() => handleViewModeChange("card")}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    );

    if (isLoading) {
      return <p>Loading employees...</p>;
    }

    // ▼▼▼ 変更・追加点 ▼▼▼
    // エラーがなく、ソート済みデータがある場合に表示
    if (sortedData) {
      return (
        <>
          <ViewModeToggle />
          {viewMode === "list" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* 表示するデータを `data` から `sortedData` に変更 */}
              {sortedData.map((employee) => (
                <EmployeeListItem
                  employee={employee}
                  key={employee.id}
                  viewMode={viewMode}
                />
              ))}
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* 表示するデータを `data` から `sortedData` に変更 */}
              {sortedData.map((employee) => (
                // <Grid item xs={12} sm={6} md={4} key={employee.id}>
                <Grid  key={employee.id}>
                  <EmployeeListItem 
                    employee={employee}
                    viewMode={viewMode}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      );
    }
    
    // エラー時の表示（任意）
    if (error) {
      return <p>Error loading employees...</p>;
    }
  }
);

EmployeeListContainer.displayName = 'EmployeeListContainer';
