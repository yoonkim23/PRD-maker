"use client";

import { useState, type FormEvent } from "react";
import SpecView from "@/components/SpecView";
import { TIMEFRAMES, type Spec, type Timeframe } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent";

export default function Home() {
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [target, setTarget] = useState("");
  const [timeframe, setTimeframe] = useState<Timeframe>("해커톤 24시간");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState<Spec | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !problem.trim()) {
      setError("아이디어 이름과 문제를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setSpec(null);
    try {
      const res = await fetch("/api/specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, problem, target, timeframe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "PRD를 만들지 못했습니다.");
        return;
      }
      setSpec(data.spec);
    } catch {
      setError("서버에 연결하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">아이디어 이름</span>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="해커톤 팀원 매칭 서비스"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">해결하려는 문제</span>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            maxLength={1000}
            placeholder="해커톤 직전에 팀을 못 구해서 혼자 나가거나 포기한다"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            타깃 유저 <span className="font-normal text-muted">(선택)</span>
          </span>
          <input
            className={inputClass}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="해커톤 처음 나가는 대학생"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">개발 기간</span>
          <select
            className={inputClass}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
          >
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "PRD 작성 중... (10~30초)" : "PRD 만들기"}
        </button>
      </form>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {spec && <SpecView spec={spec} />}
    </main>
  );
}
