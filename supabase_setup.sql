-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  source TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read leads
CREATE POLICY "Allow authenticated reads" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to manage settings
CREATE POLICY "Allow authenticated manage settings" ON settings
  FOR ALL
  TO authenticated
  USING (true);

-- Bucket público para armazenar a logo
insert into storage.buckets (id, name, public)
values ('brand', 'brand', true)
on conflict (id) do nothing;

-- Policy: qualquer um pode ver (logo é pública na landing)
create policy "Logo pública"
  on storage.objects for select
  using (bucket_id = 'brand');

-- Policy: somente admin autenticado pode fazer upload
create policy "Somente admin faz upload"
  on storage.objects for insert
  with check (
    bucket_id = 'brand'
    and auth.role() = 'authenticated'
  );

-- Policy: somente admin pode deletar/atualizar
create policy "Somente admin atualiza"
  on storage.objects for update
  using (
    bucket_id = 'brand'
    and auth.role() = 'authenticated'
  );

-- Adicionar configurações de marca na tabela settings
insert into settings (key, value) values
('brand', '{
  "nome": "OmniVendas",
  "slogan": "Transforme seu WhatsApp em máquina de vendas",
  "logo_url": "",
  "primary_color": "#F97316",
  "secondary_color": "#EA580C",
  "accent_color": "#FED7AA"
}')
on conflict (key) do nothing;
