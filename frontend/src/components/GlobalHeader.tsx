"use client";

import { AppBar, Box, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

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
  const { mode, toggleTheme } = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
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

          {/* ダークモード切り替えボタン */}
          <Tooltip title={mode === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
