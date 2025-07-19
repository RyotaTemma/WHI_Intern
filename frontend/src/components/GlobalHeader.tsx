"use client";

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { usePathname } from "next/navigation";


export interface GlobalHeaderProps {
  title: string;
}

const pageTitles: Record<string, string> = {
  "/": "社員検索",
  "/employee": "社員詳細",
};

export function GlobalHeader({ title }: GlobalHeaderProps) {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] ?? pathname;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            background:
              "linear-gradient(45deg, rgb(0, 91, 172), rgb(94, 194, 198))",
          }}
        >
          <Link href="/">
            <PeopleIcon fontSize={"large"} sx={{ mr: 2 }} />
          </Link>
          <Link href="/">
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1, mr: 1 }}>
              {title}
            </Typography>
          </Link>
          <Typography variant="h6" component="h1" sx={{ mr: 1 }}>
            -
          </Typography>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, mr: 1 }}>
            {currentPage}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
