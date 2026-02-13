-- Drop old permissive public policies on form_submissions
-- These allowed unauthenticated access which conflicts with SaaS auth model
DROP POLICY IF EXISTS "Allow public read" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow public insert" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow public delete" ON public.form_submissions;

-- Add delete policy for users (own submissions only)
CREATE POLICY "Users delete own submissions" ON public.form_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Add admin delete policy
CREATE POLICY "Admins delete all submissions" ON public.form_submissions
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
