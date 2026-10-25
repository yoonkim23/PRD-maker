import type { Spec } from "@/lib/types";

// 브라우저/서버 공용. 섹션 순서는 components/SpecView.tsx와 같게 유지한다.
export function specToMarkdown(spec: Spec): string {
  const list = (items: string[]) => items.map((x) => `- ${x}`).join("\n");

  const sections: [string, string][] = [
    ["문제", spec.problem],
    ["타깃 유저", list(spec.target_users.map((u) => `**${u.persona}**: ${u.pain}`))],
    ["핵심 기능", list(spec.core_features.map((f) => `[${f.priority}] **${f.name}**: ${f.description}`))],
    ["유저 플로우", spec.user_flow.map((s, i) => `${i + 1}. ${s}`).join("\n")],
    ["화면", list(spec.screens.map((s) => `**${s.name}**: ${s.purpose}`))],
    [
      "데이터 모델",
      "```\n" + spec.data_model.map((t) => `${t.table}\n  ${t.columns.join("\n  ")}`).join("\n\n") + "\n```",
    ],
    [
      "API",
      "```\n" + spec.api_endpoints.map((a) => `${a.method} ${a.path}  # ${a.description}`).join("\n") + "\n```",
    ],
    ["이번에 안 하는 것", list(spec.out_of_scope)],
    ["리스크", list(spec.risks)],
    [
      "팀 역할 분담",
      (spec.team_roles ?? []).map((r) => `### ${r.role}\n${list(r.tasks)}`).join("\n\n"),
    ],
    ["첫 프롬프트", "```\n" + spec.first_prompt + "\n```"],
  ];

  return [
    `# ${spec.product_name}`,
    `> ${spec.one_liner}`,
    ...sections.filter(([, body]) => body.trim()).map(([title, body]) => `## ${title}\n\n${body}`),
  ].join("\n\n") + "\n";
}
