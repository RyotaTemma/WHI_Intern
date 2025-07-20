"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 'ja' | 'en';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    messages: Record<string, unknown>;
    isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = (): LocaleContextType => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

interface LocaleProviderProps {
    children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
    // システムの言語設定を取得（デフォルト）
    const getSystemLocale = (): Locale => {
        if (typeof window !== 'undefined') {
            const lang = navigator.language;
            return lang.startsWith('en') ? 'en' : 'ja';
        }
        return 'ja';
    };

    const [locale, setLocaleState] = useState<Locale>(getSystemLocale());
    const [messages, setMessages] = useState<Record<string, unknown>>({});
    const [isLoading, setIsLoading] = useState(true);

    // メッセージを動的に読み込む
    const loadMessages = async (newLocale: Locale) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/messages/${newLocale}.json`);
            if (response.ok) {
                const newMessages = await response.json();
                setMessages(newMessages);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ローカルストレージから設定を復元
    useEffect(() => {
        const savedLocale = localStorage.getItem('preferredLanguage') as Locale;
        if (savedLocale && ['ja', 'en'].includes(savedLocale)) {
            setLocaleState(savedLocale);
        }
    }, []);

    // ロケールが変更されたときにメッセージを読み込み
    useEffect(() => {
        loadMessages(locale);
    }, [locale]);

    // 設定をローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('preferredLanguage', locale);
    }, [locale]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
    };

    const contextValue: LocaleContextType = {
        locale,
        setLocale,
        messages,
        isLoading,
    };

    // 翻訳データが読み込まれるまでローディング表示
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    );
} 