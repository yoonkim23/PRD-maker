import type { Spec, SpecInput } from "@/lib/types";

// Step 1 전용 가짜 데이터. Step 2에서 fetch("/api/specs")로 바꾸면서 지운다.
export function mockSpec(input: SpecInput): Spec {
  return {
    product_name: input.title || "팀메이트",
    one_liner: `${input.timeframe} 안에 만드는, 해커톤 직전 팀원을 3분 만에 찾아 주는 매칭 서비스`,
    problem:
      input.problem ||
      "해커톤 직전에 팀을 못 구해서 혼자 나가거나 참가를 포기한다. 단톡방 구인글은 묻히고, 서로의 스택을 알 수 없다.",
    target_users: [
      {
        persona: input.target || "해커톤 처음 나가는 대학생",
        pain: "아는 사람이 없어서 팀을 못 꾸리고, 혼자 나가기는 부담스럽다",
      },
      {
        persona: "팀에 디자이너가 없는 개발자 2인 팀",
        pain: "부족한 역할 한 명을 급하게 찾아야 하는데 어디에 물어야 할지 모른다",
      },
    ],
    core_features: [
      { name: "프로필 카드", description: "역할, 스택, 가능한 시간을 30초 안에 입력", priority: "P0" },
      { name: "역할 기반 매칭", description: "우리 팀에 없는 역할을 가진 사람을 추천", priority: "P0" },
      { name: "합류 요청", description: "카드에서 바로 합류 요청을 보내고 수락", priority: "P0" },
      { name: "해커톤별 방", description: "대회 단위로 참가자를 묶어서 보여줌", priority: "P1" },
      { name: "카카오톡 알림", description: "합류 요청이 오면 알림", priority: "P1" },
    ],
    user_flow: [
      "참가할 해커톤을 고른다",
      "내 프로필 카드를 만든다",
      "추천된 팀/사람 카드를 넘겨 본다",
      "마음에 드는 팀에 합류 요청을 보낸다",
      "수락되면 팀 채널 링크를 받는다",
    ],
    screens: [
      { name: "해커톤 선택", purpose: "참가할 대회를 고르고 참가자 수를 본다" },
      { name: "매칭 피드", purpose: "추천 카드를 넘기며 합류 요청을 보낸다" },
      { name: "내 팀", purpose: "받은 요청을 수락하고 팀원을 확인한다" },
    ],
    data_model: [
      { table: "profiles", columns: ["id uuid", "name text", "role text", "stack text[]", "hackathon_id uuid"] },
      { table: "teams", columns: ["id uuid", "hackathon_id uuid", "name text", "needed_roles text[]"] },
      { table: "join_requests", columns: ["id uuid", "team_id uuid", "profile_id uuid", "status text"] },
    ],
    api_endpoints: [
      { method: "POST", path: "/api/profiles", description: "프로필 카드 생성" },
      { method: "GET", path: "/api/matches", description: "역할 기반 추천 목록" },
      { method: "POST", path: "/api/join-requests", description: "합류 요청 보내기" },
      { method: "PATCH", path: "/api/join-requests/[id]", description: "요청 수락/거절" },
    ],
    out_of_scope: ["로그인 (닉네임만)", "실시간 채팅", "팀 평가/리뷰"],
    risks: [
      "초기 참가자가 적으면 추천이 비어 보인다 → 시드 데이터 20명",
      "역할 분류가 애매하다 → 역할을 4개로 고정",
    ],
    first_prompt:
      "docs/PRD.md를 읽고 P0 기능 3개만 구현해. Next.js App Router + Supabase. 먼저 profiles 테이블과 프로필 카드 입력 화면부터 만들고, 끝나면 확인 방법을 알려줘.",
  };
}
