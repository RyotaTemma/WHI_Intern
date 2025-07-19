"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function BackButton () {
  const router = useRouter();

  return (
    <>
      <Button type="button" onClick={() => router.back()}>
        戻る
      </Button>
    </>
  );
}
