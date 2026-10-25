// docs/API.md 6번 출력 스키마
export type Spec = {
  product_name: string;
  one_liner: string;
  problem: string;
  target_users: { persona: string; pain: string }[];
  core_features: { name: string; description: string; priority: "P0" | "P1" }[];
  user_flow: string[];
  screens: { name: string; purpose: string }[];
  data_model: { table: string; columns: string[] }[];
  api_endpoints: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    description: string;
  }[];
  out_of_scope: string[];
  risks: string[];
  first_prompt: string;
};

export const TIMEFRAMES = ["해커톤 24시간", "1주", "1달"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export type SpecInput = {
  title: string;
  problem: string;
  target: string;
  timeframe: Timeframe;
};

// GET /api/specs 목록 아이템
export type SpecListItem = {
  id: string;
  created_at: string;
  title: string;
  product_name: string;
  timeframe: string;
  one_liner: string | null;
};
