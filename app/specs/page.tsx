"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SpecListItem } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: SpecListItem[] };

export default function SpecsPage() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/specs");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setState({ status: "error", message: data.error ?? "PRD 목록을 불러오지 못했습니다." });
          return;
        }
        setState({ status: "success", items: data.items });
      } catch {
        if (!cancelled) setState({ status: "error", message: "서버에 연결하지 못했습니다." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h2 className="mb-4 text-lg font-semibold">내 PRD 목록</h2>

      {state.status === "loading" && <p className="text-sm text-muted">불러오는 중...</p>}

      {state.status === "error" && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </p>
      )}

      {state.status === "success" && state.items.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-sm">
          <p className="text-muted">아직 만든 PRD가 없다.</p>
          <Link href="/" className="mt-2 inline-block font-medium text-accent">
            PRD 만들러 가기
          </Link>
        </div>
      )}

      {state.status === "success" && state.items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {state.items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/specs/${item.id}`}
                className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                <p className="text-xs text-muted">
                  {item.timeframe} · {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </p>
                <p className="mt-1 font-semibold break-words">{item.product_name}</p>
                {item.one_liner && (
                  <p className="mt-1 text-sm text-muted break-words">{item.one_liner}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
