"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<ThemeMode>(systemPrefersDark ? 'dark' : 'light');

    // ローカルストレージから設定を復元
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as ThemeMode;
        if (savedMode && ['light', 'dark'].includes(savedMode)) {
        setMode(savedMode);
        }
    }, []);

    // 設定をローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    // Material-UIテーマを作成
    const theme = React.useMemo(
        () =>
        createTheme({
            palette: {
            mode,
            primary: {
                main: mode === 'dark' ? '#5ec2c6' : '#005bac',
            },
            secondary: {
                main: mode === 'dark' ? '#005bac' : '#5ec2c6',
            },
            },
            components: {
            MuiButton: {
                styleOverrides: {
                root: {
                    textTransform: 'none',
                },
                },
            },
            },
        }),
        [mode],
    );

    const contextValue: ThemeContextType = {
        mode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}