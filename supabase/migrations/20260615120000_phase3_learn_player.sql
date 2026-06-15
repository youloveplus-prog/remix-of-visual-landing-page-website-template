-- Phase 3: enrollments + quiz_questions + certificates

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.content_items(id) on delete cascade,
  progress numeric not null default 0,
  completed_at timestamptz,
  enrolled_at timestamptz not null default now(),
  unique (user_id, item_id)
);
grant select, insert, update on public.enrollments to authenticated;
grant all on public.enrollments to service_role;
alter table public.enrollments enable row level security;
create policy "enrollments_select_own" on public.enrollments
  for select to authenticated using (auth.uid() = user_id);
create policy "enrollments_insert_own" on public.enrollments
  for insert to authenticated with check (auth.uid() = user_id);
create policy "enrollments_update_own" on public.enrollments
  for update to authenticated using (auth.uid() = user_id);
create index if not exists enrollments_user_idx on public.enrollments(user_id);
create index if not exists enrollments_item_idx on public.enrollments(item_id);

create or replace function public.handle_course_purchase_enroll()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.content_items where id = new.item_id and kind = 'course') then
    insert into public.enrollments (user_id, item_id)
    values (new.user_id, new.item_id)
    on conflict (user_id, item_id) do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists content_purchases_enroll_course on public.content_purchases;
create trigger content_purchases_enroll_course
after insert on public.content_purchases
for each row execute function public.handle_course_purchase_enroll();

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  position int not null default 0,
  question text not null,
  choices jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.quiz_questions to anon, authenticated;
grant all on public.quiz_questions to service_role;
alter table public.quiz_questions enable row level security;
create policy "quiz_questions_public_read" on public.quiz_questions for select using (true);
create index if not exists quiz_questions_lesson_idx on public.quiz_questions(lesson_id);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.content_items(id) on delete cascade,
  code text not null unique default encode(gen_random_bytes(8), 'hex'),
  issued_at timestamptz not null default now(),
  unique (user_id, item_id)
);
grant select, insert on public.certificates to authenticated;
grant all on public.certificates to service_role;
alter table public.certificates enable row level security;
create policy "certificates_select_own" on public.certificates
  for select to authenticated using (auth.uid() = user_id);
create policy "certificates_insert_own" on public.certificates
  for insert to authenticated with check (auth.uid() = user_id);
