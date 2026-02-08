
-- Create documents storage bucket for photo and signature uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Allow anyone to upload to documents bucket
CREATE POLICY "Allow public upload to documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to read from documents bucket
CREATE POLICY "Allow public read from documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow anyone to update in documents bucket
CREATE POLICY "Allow public update in documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

-- Allow anyone to delete from documents bucket
CREATE POLICY "Allow public delete from documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');
