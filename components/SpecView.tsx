"use client";

import type { ReactNode } from "react";
import { specToMarkdown } from "@/lib/markdown";
import type { Spec } from "@/lib/types";

// 내 버전 8-4: PRD를 <제품명>.md 파일로 저장
function downloadMarkdown(spec: Spec) {
  const blob = new Blob([specToMarkdown(spec)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${spec.product_name.replace(/[\\/:*?"<>|]/g, "").trim() || "PRD"}.md`;
  a.click();
  // 바로 revoke하면 일부 브라우저(Safari/Firefox)에서 다운로드가 끊긴다
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-5">
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted">{label}</h3>
      {children}
    </section>
  );
}

function PriorityBadge({ priority }: { priority: "P0" | "P1" }) {
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${
        priority === "P0" ? "bg-accent text-white" : "bg-border text-muted"
      }`}
    >
      {priority}
    </span>
  );
}

export default function SpecView({ spec }: { spec: Spec }) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold break-words">{spec.product_name}</h2>
          <p className="mt-1 text-sm text-muted break-words">{spec.one_liner}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
          <button
            type="button"
            onClick={() => downloadMarkdown(spec)}
            className="rounded-lg border border-accent px-3 py-1.5 text-xs font-medium text-accent"
          >
            .md 다운로드
          </button>
          {/* P1 */}
          <button
            type="button"
            disabled
            title="준비 중"
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted disabled:cursor-not-allowed"
          >
            마크다운 복사
          </button>
        </div>
      </header>

      <Section label="문제">
        <p className="text-sm leading-6">{spec.problem}</p>
      </Section>

      <Section label="타깃 유저">
        <ul className="flex flex-col gap-2 text-sm">
          {spec.target_users.map((u) => (
            <li key={u.persona}>
              <p className="font-medium">{u.persona}</p>
              <p className="text-muted">{u.pain}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="핵심 기능">
        <ul className="flex flex-col gap-2 text-sm">
          {spec.core_features.map((f) => (
            <li key={f.name} className="flex items-start gap-2">
              <PriorityBadge priority={f.priority} />
              <p className="min-w-0">
                <span className="font-medium">{f.name}</span>
                <span className="text-muted"> — {f.description}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="유저 플로우">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {spec.user_flow.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section label="화면">
        <ul className="flex flex-col gap-1 text-sm">
          {spec.screens.map((s) => (
            <li key={s.name}>
              <span className="font-medium">{s.name}</span>
              <span className="text-muted"> — {s.purpose}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="데이터 모델 / API">
        <div className="flex flex-col gap-3 font-mono text-xs">
          {spec.data_model.map((t) => (
            <div key={t.table} className="rounded-lg bg-bg p-3">
              <p className="font-semibold">{t.table}</p>
              <p className="mt-1 break-words text-muted">{t.columns.join(", ")}</p>
            </div>
          ))}
          <ul className="flex flex-col gap-1 rounded-lg bg-bg p-3">
            {spec.api_endpoints.map((a) => (
              <li key={`${a.method} ${a.path}`} className="break-words">
                <span className="font-semibold">{a.method}</span> {a.path}
                <span className="text-muted"> — {a.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label="이번에 안 하는 것">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {spec.out_of_scope.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section label="리스크">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {spec.risks.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      {spec.team_roles?.length > 0 && (
        <Section label="팀 역할 분담">
          <ul className="flex flex-col gap-3 text-sm">
            {spec.team_roles.map((r) => (
              <li key={r.role}>
                <p className="font-medium">{r.role}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
                  {r.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section label="첫 프롬프트">
        <pre className="whitespace-pre-wrap break-words rounded-lg bg-bg p-3 font-mono text-xs leading-5">
          {spec.first_prompt}
        </pre>
      </Section>
    </article>
  );
}
