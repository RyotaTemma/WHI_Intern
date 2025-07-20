"use client";

import { AppBar, Box, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useTranslations } from '../hooks/useTranslations';
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface GlobalHeaderProps {
  title: string;
}

export function GlobalHeader({ title }: GlobalHeaderProps) {
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const t = useTranslations('header');

  const pageTitles: Record<string, string> = {
    "/": t('employeeSearch'),
    "/employee": t('employeeDetails'),
  };

  // パスを正規化（末尾のスラッシュを除去）
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentPage = pageTitles[normalizedPath] ?? normalizedPath;

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

          {/* 言語切り替えボタン */}
          <LanguageSwitcher />

          {/* ダークモード切り替えボタン */}
          <Tooltip title={mode === 'light' ? t('toggleDarkMode') : t('toggleLightMode')}>
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
