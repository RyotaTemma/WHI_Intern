import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from 'react';
import { BackButton } from "@/components/BackButton";

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
