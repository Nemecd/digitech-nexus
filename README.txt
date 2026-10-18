DIGITECH NEXUS - COURSE V2 + DEPLOY TOOLS
==========================================

WHAT IS IN THIS ZIP (paths match your project)

  deploy.ps1                                   NEW  build + package script (Windows)
  server/update.sh                             NEW  upload this one to the server home folder
  sql/course-v2.sql                            NEW  run once in the Supabase SQL editor
  lib/auth.ts                                  NEW or same as before (requireAdmin helper)
  lib/video.ts                                 NEW  turns YouTube/Vimeo links into a player
  app/dashboard/courses/[id]/page.tsx          REPLACES  player, lesson list, progress, certificate
  app/dashboard/courses/[id]/actions.ts        NEW  mark complete + issue certificate
  app/dashboard/courses/[id]/MarkCompleteButton.tsx   NEW
  app/certificate/[id]/page.tsx                NEW  printable certificate (public link = verification)
  app/certificate/[id]/PrintButton.tsx         NEW
  app/product/[id]/page.tsx                    REPLACES  lesson outline, instructor, reviews
  app/product/[id]/actions.ts                  NEW  submit / delete review
  app/product/[id]/ReviewForm.tsx              NEW
  app/admin/products/[id]/lessons/page.tsx     REPLACES  edit, reorder, delete lessons + instructor
  app/admin/products/[id]/lessons/actions.ts   REPLACES

These files were type-checked against Next 16 and the Supabase library, and a full
production build of them succeeded.

HOW TO APPLY
  1. Supabase > SQL editor > paste sql/course-v2.sql > Run.
     (This also fixes the lesson Delete button, which silently did nothing before.)
  2. Unzip into your project root (the folder with package.json). Replace when asked.
  3. Link the course, eBook and shop cards to the new product page so shoppers can see
     what is inside. In app/courses/page.tsx, app/ebooks/page.tsx and app/shop/page.tsx,
     wrap the product title like this (use each page's own variable, e.g. c, e or p),
     and make sure   import Link from "next/link";   is at the top of the file:

       <Link href={`/product/${c.id}`} className="hover:text-gold transition-colors">{c.title}</Link>

  4. Add to .gitignore:   deploy.zip   and   .env.production.local
  5. npm run dev, then test (below).
  6. Deploy with deploy.ps1 (see the Deploy Runbook doc).

TEST CHECKLIST
  Admin: Products > a course > Manage Lessons
    - add 3 lessons using normal YouTube links; reorder with the arrows; edit one; delete one
    - save an instructor name and bio
  Public: open /product/<course id> while logged out
    - you see the lesson list (titles only), the instructor, and reviews
  Student (a different account that bought the course):
    - the course opens with the video inside the page
    - "Mark complete & continue" moves to the next lesson and the progress bar fills
    - leave and come back: it resumes at the first lesson you have not finished
    - finish every lesson: "Get my certificate" appears; the certificate prints / saves as PDF
    - on the product page, leave a star review; admin sees a delete icon on every review

NOT BUILT YET (suggested "Course v3", in order of value)
  Lesson files (PDFs / slides)
    table lesson_resources(lesson_id, title, file_path); private storage bucket;
    admin uploads from the browser; students get a signed link from a server action
    after an ownership check (same pattern as eBook downloads).
  Quizzes
    quizzes, quiz_questions, quiz_attempts. Grade on the server and never send the
    correct answers to the browser. Optionally require passing before the certificate.
  Assignments
    assignments + assignment_submissions (file or text, status, feedback) and an admin
    review page, the same pattern as service requests.
  Discussions
    lesson_comments(lesson_id, user_id, parent_id, body) under the player; admin can delete.
  Real video protection
    Embedding stops people casually copying a link, but anyone who finds the video link can
    still watch it. True protection needs a video host with signed playback (Mux, Bunny
    Stream, or Vimeo with domain privacy). That is a paid service and a separate decision.

KNOWN LIMITS TODAY
  - If a YouTube owner has switched off embedding, the page shows an "Open video" link instead.
  - A student who buys the same course twice gets two purchase records; both work.
  - Only buyers can review; reviews show first name + last initial only.
