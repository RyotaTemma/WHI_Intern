"use client";

import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import { useTranslations } from '../hooks/useTranslations';

export function GlobalContainer({ children }: { children?: React.ReactNode }) {
  const t = useTranslations('header');

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader title={t('title')} />
      </header>

      <VerticalSpacer height={32} />

      <main>{children}</main>

      <footer>
        <GlobalFooter />
      </footer>
    </Container>
  );
}
