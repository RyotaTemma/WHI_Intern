// 社員検索ページ
import type { Metadata } from "next";
import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Talentia - 社員検索",
};

export default function Home() {
  return (
    <GlobalContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchEmployees />
      </Suspense>
    </GlobalContainer>
  );
}
