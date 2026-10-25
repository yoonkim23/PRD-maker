-- specs 테이블 (docs/API.md 5번)
-- Supabase 대시보드 > SQL Editor에 전체 붙여넣고 Run.

create table if not exists public.specs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  problem text not null,
  target text,
  timeframe text not null,
  product_name text not null,
  spec jsonb not null
);

-- 목록을 최신순으로 읽으므로
create index if not exists specs_created_at_idx on public.specs (created_at desc);

-- RLS를 켜고 정책은 만들지 않는다.
-- publishable 키(브라우저)로는 아무것도 못 읽고, secret 키(서버)만 RLS를 우회해 접근한다.
alter table public.specs enable row level security;

-- 2026-05-30 이후 프로젝트는 새 테이블이 API에 자동 노출되지 않는다.
-- 이 grant가 없으면 42501 permission denied for table specs.
grant select, insert, update, delete on table public.specs to service_role;
