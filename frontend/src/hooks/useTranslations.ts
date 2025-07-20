import { useLocale } from '../components/LocaleProvider';

export function useTranslations(namespace?: string) {
    const { messages, isLoading } = useLocale();

    return (key: string): string => {
        // ローディング中は空文字を返してHydration mismatchを防ぐ
        if (isLoading) {
            return '';
        }

        const keys = namespace ? `${namespace}.${key}` : key;
        const keyPath = keys.split('.');
        
        let value: Record<string, unknown> | string | undefined = messages;
        for (const k of keyPath) {
            if (typeof value === 'object' && value !== null && k in value) {
                value = value[k] as Record<string, unknown> | string | undefined;
            } else {
                value = undefined;
                break;
            }
        }
        
        return typeof value === 'string' ? value : key;
    };
} 