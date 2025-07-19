"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeListItem } from "./EmployeeListItem";
import { Employee, EmployeeT } from "../models/Employee";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

import { Box, IconButton, Tooltip, Stack, Divider, Grid } from "@mui/material";

export type EmployeesContainerProps = {
  filterText: string;
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

export function EmployeeListContainer({ filterText }: EmployeesContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialViewMode = (): "list" | "card" => {
    const view = searchParams.get("view");
    if (view === "card") {
      return "card";
    }
    return "list"; // デフォルトは "list"
  };

  const [viewMode, setViewMode] = useState<"list" | "card">(getInitialViewMode);

  const encodedFilterText = encodeURIComponent(filterText);
  const { data, error, isLoading } = useSWR<Employee[], Error>(
    `/api/employees?filterText=${encodedFilterText}`,
    employeesFetcher
  );

  const handleViewModeChange = (mode: "list" | "card") => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (error != null) {
      console.error(`Failed to fetch employees filtered by filterText`, error);
    }
  }, [error, filterText]);

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
