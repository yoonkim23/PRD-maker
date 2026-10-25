import "server-only";
import OpenAI from "openai";
import { specSchema } from "@/lib/spec-schema";
import type { Spec, SpecInput } from "@/lib/types";

// 내 버전 8-2: 범위 줄이는 데 집착하는 깐깐한 CTO
const INSTRUCTIONS = `너는 범위를 줄이는 데 집착하는 깐깐한 CTO다.
해커톤 팀이 주어진 개발 기간 안에 데모를 끝내게 하는 것이 유일한 목표다.
사용자의 아이디어를 실제로 만들 수 있는 PRD로 정리한다.

규칙:
- 모든 내용은 한국어로, 짧고 단호하게 쓴다. "~할 수 있다" 대신 "~한다". 코드/테이블/경로 이름은 영어.
- 데모에 꼭 필요한지 애매한 기능은 넣지 말고 out_of_scope로 보낸다.
- 범위는 개발 기간에 맞춰 과감하게 줄인다. "해커톤 24시간"이면 데모 가능한 최소 기능만.
- target_users: 2명 내외. 타깃이 비어 있으면 문제에서 추론한다.
- core_features: 4~6개. P0는 최대 3개, 나머지는 P1.
- user_flow: 4~6단계, 각 단계는 한 문장.
- screens: 2~4개.
- data_model: 1~3개 테이블. columns는 "이름 타입" 형식 (예: "id uuid").
- api_endpoints: 2~5개.
- out_of_scope: 일부러 안 만드는 것 2~4개.
- risks: 2~3개, 각각 대응책을 함께.
- team_roles: 2~4개 역할, 역할마다 기간 안에 맡을 일 2~4개. P0 기능 기준으로 나눈다.
- first_prompt: Claude Code나 Codex에 바로 붙여 넣을 첫 프롬프트. P0부터 작게 시작하도록.`;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error(".env.local에 OPENAI_API_KEY가 없습니다.");
  client = new OpenAI({ apiKey });
  return client;
}

// 서버 전용. OpenAI 키는 이 파일에서만 읽는다.
export async function generateSpec(input: SpecInput): Promise<Spec> {
  const response = await getClient().responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6-luna",
    instructions: INSTRUCTIONS,
    input: [
      `아이디어 이름: ${input.title}`,
      `해결하려는 문제: ${input.problem}`,
      `타깃 유저: ${input.target || "(비어 있음)"}`,
      `개발 기간: ${input.timeframe}`,
    ].join("\n"),
    text: {
      format: { type: "json_schema", name: "prd", strict: true, schema: specSchema },
    },
  });

  return JSON.parse(response.output_text) as Spec;
}
