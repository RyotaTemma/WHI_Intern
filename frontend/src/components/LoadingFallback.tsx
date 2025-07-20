"use client";

import { useTranslations } from '../hooks/useTranslations';

export function LoadingFallback() {
  const t = useTranslations('common');
  
  return <div>{t('loading')}</div>;
} 