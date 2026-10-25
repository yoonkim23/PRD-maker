import { connection } from "next/server";
import { generateSpec } from "@/lib/openai";
import { getSupabase } from "@/lib/supabase";
import { TIMEFRAMES, type Spec, type SpecInput, type Timeframe } from "@/lib/types";

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function parseInput(body: unknown): SpecInput | string {
  if (typeof body !== "object" || body === null) return "요청 형식이 올바르지 않습니다.";
  const { title, problem, target, timeframe } = body as Record<string, unknown>;

  const t = typeof title === "string" ? title.trim() : "";
  const p = typeof problem === "string" ? problem.trim() : "";
  if (t.length < 1 || t.length > 100) return "아이디어 이름은 1~100자로 입력해 주세요.";
  if (p.length < 1 || p.length > 1000) return "문제는 1~1000자로 입력해 주세요.";

  return {
    title: t,
    problem: p,
    target: typeof target === "string" ? target.trim() : "",
    timeframe: TIMEFRAMES.includes(timeframe as Timeframe)
      ? (timeframe as Timeframe)
      : "해커톤 24시간",
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("요청 본문이 JSON이 아닙니다.", 400);
  }

  const input = parseInput(body);
  if (typeof input === "string") return errorResponse(input, 400);

  let spec: Spec;
  try {
    spec = await generateSpec(input);
  } catch (e) {
    console.error("generateSpec failed", e);
    return errorResponse("PRD 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.", 502);
  }

  // Step 2: 저장 없이 결과만. Step 3에서 specs insert를 붙이고 { id, created_at, spec }으로 바꾼다.
  return Response.json({ spec }, { status: 201 });
}

export async function GET() {
  // DB 조회는 요청 시점에만 (빌드 때 prerender 하지 않음)
  await connection();

  try {
    const { data, error } = await getSupabase()
      .from("specs")
      .select("id, created_at, title, product_name, timeframe, one_liner:spec->>one_liner")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;

    return Response.json({ items: data });
  } catch (e) {
    console.error("select specs failed", e);
    return errorResponse("PRD 목록을 불러오지 못했습니다.", 500);
  }
}
