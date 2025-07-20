"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useState } from "react";
import { useLocale, type Locale } from "./LocaleProvider";

export function LanguageSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { locale, setLocale } = useLocale();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    handleClose();
  };

  return (
    <>
      <Button
        variant="text"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        sx={{ color: 'inherit', textTransform: 'none' }}
      >
        言語 / Language
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('ja')} selected={locale === 'ja'}>日本語</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')} selected={locale === 'en'}>English</MenuItem>
      </Menu>
    </>
  );
} 