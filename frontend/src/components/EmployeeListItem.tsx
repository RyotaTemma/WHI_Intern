import PersonIcon from "@mui/icons-material/Person";

import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import { Employee } from "../models/Employee";
import Link from "next/link";

export type EmployeeListItemProps = {
  employee: Employee;
  viewMode: "list" | "card";
};

export function EmployeeListItem(prop: EmployeeListItemProps) {
  const { employee, viewMode } = prop;

  // リスト表示の場合
  if (viewMode === "list") {
    return (
      <Link
        href={`/employee?id=${employee.id}`}
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: 'action.hover',  // Material-UI標準のホバー色
            },
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Avatar sx={{ width: 48, height: 48 }}>
                <PersonIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Box display="flex" flexDirection="column">
                <Typography>{employee.name}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // カード表示の場合
  else if (viewMode === "card") {
    return (
      <Link
        href={`/employee?id=${employee.id}`}
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            width: 200,
            height: 200,
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: 'action.hover',  // Material-UI標準のホバー色
            },
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Avatar sx={{ width: 48, height: 48 }}>
                <PersonIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Box display="flex" flexDirection="column">
                <Typography>{employee.name}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return null;
}
