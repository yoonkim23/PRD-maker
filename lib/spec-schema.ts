// docs/API.md 6번 Spec의 JSON Schema (OpenAI 구조화 출력, strict: true)
// strict 규칙: 모든 object에 additionalProperties: false, 모든 속성을 required에.
// 개수 제한(4~6개 등)은 스키마가 아니라 lib/openai.ts의 instructions로 지시한다.

const str = { type: "string" } as const;
const strArray = { type: "array", items: str } as const;

function obj(properties: Record<string, unknown>) {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  } as const;
}

export const specSchema = obj({
  product_name: str,
  one_liner: str,
  problem: str,
  target_users: { type: "array", items: obj({ persona: str, pain: str }) },
  core_features: {
    type: "array",
    items: obj({
      name: str,
      description: str,
      priority: { type: "string", enum: ["P0", "P1"] },
    }),
  },
  user_flow: strArray,
  screens: { type: "array", items: obj({ name: str, purpose: str }) },
  data_model: { type: "array", items: obj({ table: str, columns: strArray }) },
  api_endpoints: {
    type: "array",
    items: obj({
      method: { type: "string", enum: ["GET", "POST", "PATCH", "DELETE"] },
      path: str,
      description: str,
    }),
  },
  out_of_scope: strArray,
  risks: strArray,
  team_roles: { type: "array", items: obj({ role: str, tasks: strArray }) },
  first_prompt: str,
});
