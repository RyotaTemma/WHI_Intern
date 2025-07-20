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
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" component="div" sx={{
                  whiteSpace: "nowrap",    // テキストを折り返さない
                  overflow: "hidden",        // はみ出した部分を隠す
                  textOverflow: "ellipsis",  // はみ出した部分を「...」で表示
                }}>
                  {employee.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`所属: ${employee.affiliation}`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}>
                  {`${employee.age}歳`}
                </Typography>
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
            width: 225,
            height: 200,
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: 'action.hover',  // Material-UI標準のホバー色
            },
          }}
        >
          <CardContent sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Avatar sx={{ width: 48, height: 48 }}>
                <PersonIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Box display="flex" flexDirection="column" sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" component="div" sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {employee.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${employee.affiliation}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {`${employee.age}歳`}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Link >
    );
  }

  return null;
}
