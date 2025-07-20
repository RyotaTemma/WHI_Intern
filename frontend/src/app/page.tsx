// 社員検索ページ
import type { Metadata } from "next";
import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { LoadingFallback } from "../components/LoadingFallback";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "タレントマネジメントシステム - 社員検索",
};

export default function Home() {
  return (
    <GlobalContainer>
      <Suspense fallback={<LoadingFallback />}>
        <SearchEmployees />
      </Suspense>
    </GlobalContainer>
  );
}
