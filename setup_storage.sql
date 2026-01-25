-- Add image_url column to crops table
alter table crops add column if not exists image_url text;

-- Create storage bucket for crop images.
-- Note: Supabase Storage buckets are typically created via API or Dashboard, 
-- but we can try inserting into storage.buckets if permissions allow, 
-- or rely on the user/frontend to handle it if the bucket exists.
-- A safer approach for SQL is ensuring the bucket exists via row insertion if the system allows.

insert into storage.buckets (id, name, public)
values ('crop-images', 'crop-images', true)
on conflict (id) do nothing;

-- Set up security policies for the storage bucket
create policy "Public Access to Crop Images"
on storage.objects for select
using ( bucket_id = 'crop-images' );

create policy "Authenticated Users can Upload Crop Images"
on storage.objects for insert
with check ( bucket_id = 'crop-images' and auth.role() = 'authenticated' );

create policy "Users can update their own crop images"
on storage.objects for update
using ( bucket_id = 'crop-images' and auth.uid() = owner )
with check ( bucket_id = 'crop-images' and auth.uid() = owner );

create policy "Users can delete their own crop images"
on storage.objects for delete
using ( bucket_id = 'crop-images' and auth.uid() = owner );
