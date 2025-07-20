import type { Metadata } from "next";
import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from 'react';
import { BackButton } from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Talentia - 社員詳細",
};

export default function EmployeePage() {
  return (
    <GlobalContainer>
      <BackButton />
      { /* Mark EmployeeDetailsContainer as CSR */ }
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
