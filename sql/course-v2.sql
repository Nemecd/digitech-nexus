-- =========================================================
-- COURSE V2  -  run once in the Supabase SQL editor
-- Safe to run more than once.
-- =========================================================

-- 1. FIX: admins could add lessons but never edit or delete them
drop policy if exists "Admins can update lessons" on course_lessons;
drop policy if exists "Admins can delete lessons" on course_lessons;

create policy "Admins can update lessons"
  on course_lessons for update using (is_admin());

create policy "Admins can delete lessons"
  on course_lessons for delete using (is_admin());

-- 2. LESSON PROGRESS (powers "mark complete", the progress bar and resume)
create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  lesson_id uuid not null references course_lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique (user_id, lesson_id)
);

create index if not exists idx_lesson_progress_user_product
  on lesson_progress (user_id, product_id);

alter table lesson_progress enable row level security;

drop policy if exists "Users view own progress" on lesson_progress;
drop policy if exists "Users mark own lessons complete" on lesson_progress;
drop policy if exists "Users unmark own lessons" on lesson_progress;

create policy "Users view own progress"
  on lesson_progress for select using (auth.uid() = user_id or is_admin());

-- Only people who own the course can record progress on it
create policy "Users mark own lessons complete"
  on lesson_progress for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from user_products up
      where up.user_id = auth.uid()
        and up.product_id = lesson_progress.product_id
        and up.status = 'active'
    )
  );

create policy "Users unmark own lessons"
  on lesson_progress for delete using (auth.uid() = user_id);

-- 3. CERTIFICATES (issued by the server once every lesson is complete)
create table if not exists course_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  issued_at timestamptz default now(),
  unique (user_id, product_id)
);

alter table course_certificates enable row level security;

drop policy if exists "Users view own certificates" on course_certificates;

create policy "Users view own certificates"
  on course_certificates for select using (auth.uid() = user_id or is_admin());

-- 4. REVIEWS (courses and eBooks; only buyers can write one)
create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (product_id, user_id)
);

create index if not exists idx_product_reviews_product on product_reviews (product_id);

alter table product_reviews enable row level security;

drop policy if exists "Anyone can read reviews" on product_reviews;
drop policy if exists "Buyers can review" on product_reviews;
drop policy if exists "Users edit own reviews" on product_reviews;
drop policy if exists "Users or admins delete reviews" on product_reviews;

create policy "Anyone can read reviews"
  on product_reviews for select using (true);

create policy "Buyers can review"
  on product_reviews for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from user_products up
      where up.user_id = auth.uid()
        and up.product_id = product_reviews.product_id
        and up.status in ('active', 'completed')
    )
  );

create policy "Users edit own reviews"
  on product_reviews for update using (auth.uid() = user_id);

create policy "Users or admins delete reviews"
  on product_reviews for delete using (auth.uid() = user_id or is_admin());

-- Instructor name and bio are stored inside products.metadata (no new column needed).
