"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeListItem } from "./EmployeeListItem";
import { Employee, EmployeeT } from "../models/Employee";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useTranslations } from '../hooks/useTranslations';

import { Box, IconButton, Tooltip, Stack, Divider, Grid } from "@mui/material";

// フィルターの型を定義
export interface EmployeeFilters {
  name?: string;
  affiliation?: string;
  post?: string;
  skill?: string;
}

// propsの型を`filters`オブジェクトを受け取るように変更
export type EmployeesContainerProps = {
  filters: EmployeeFilters;
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
  ({ filters }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('employee');
    const tCommon = useTranslations('common');

    const getInitialViewMode = (): "list" | "card" => {
      const view = searchParams.get("view");
      return view === "card" ? "card" : "list";
    };

    const [viewMode, setViewMode] = useState<"list" | "card">(getInitialViewMode);

    // `filters`オブジェクトからAPIのURLクエリを動的に生成
    const swrKey = (() => {
      const params = new URLSearchParams();
      // 各フィルターの値が存在する場合のみ、クエリパラメータに追加
      if (filters.name) params.append('name', filters.name);
      if (filters.affiliation) params.append('affiliation', filters.affiliation);
      if (filters.post) params.append('post', filters.post);
      if (filters.skill) params.append('skill', filters.skill);
      return `/api/employees?${params.toString()}`;
    })();

    // 生成したキーを`useSWR`に渡す
    const { data, error, isLoading, mutate } = useSWR<Employee[], Error>(
      swrKey,
      employeesFetcher
    );

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
    }, [error]); // `filterText`への依存を削除

    const ViewModeToggle = () => (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <Tooltip title={t('listView')}>
            <IconButton
              color={viewMode === "list" ? "primary" : "default"}
              onClick={() => handleViewModeChange("list")}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('cardView')}>
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
      return <p>{tCommon('loading')}</p>;
    }

    if (data != null) {
      return (
        <>
          <ViewModeToggle />
          {viewMode === "list" ? (
            // リスト表示の場合
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {data.map((employee) => (
                <EmployeeListItem
                  employee={employee}
                  key={employee.id}
                  viewMode={viewMode}
                />
              ))}
            </Box>
          ) : (
            // カード表示の場合
            <Grid container spacing={2}>
              {data.map((employee) => (
                <Grid key={employee.id}>
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
  }
);

EmployeeListContainer.displayName = 'EmployeeListContainer';
