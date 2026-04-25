import React, { useState, useRef } from "react";
import { supabase } from "../../supabase";
import { useBrand } from "../../hooks/useBrand";
import { toast } from "react-hot-toast";
import { Upload, ImageIcon, Settings, Edit, Search, RefreshCw, Save } from "lucide-react";

// Minimal UI components since they don't exist in the project
const Button = ({ children, onClick, disabled, className, style }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={style}
    className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, maxLength, className }: any) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300 ${className}`}
  />
);

const Label = ({ children, className }: any) => (
  <label className={`text-sm font-medium text-text/60 ${className}`}>
    {children}
  </label>
);

export function PersonalizacaoTab() {
  const { brand, setBrand, reload } = useBrand();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Upload da logo ─────────────────────────────────────────
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED  = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

    if (!ALLOWED.includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPG, SVG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    // Preview local imediato
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const ext      = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${ext}`; // Use timestamp to avoid cache issues

      // Upload novo arquivo
      const { error } = await supabase.storage
        .from("brand")
        .upload(fileName, file, { upsert: true, cacheControl: "3600" });

      if (error) throw error;

      // Pegar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("brand")
        .getPublicUrl(fileName);

      setBrand((b) => ({ ...b, logo_url: publicUrl }));
      toast.success("Logo enviada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar logo. Tente novamente.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  // ── Salvar todas as configurações ──────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "brand", value: brand, updated_at: new Date() });

      if (error) throw error;
      reload();
      toast.success("Personalizações salvas! A landing page foi atualizada.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const logoAtual = preview || brand.logo_url;

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── SEÇÃO: Logo ──────────────────────────────────── */}
      <section className="space-y-4 bg-card/30 p-6 rounded-2xl border border-white/5">
        <h3 className="font-bold flex items-center gap-2 text-lg">
          <ImageIcon className="w-5 h-5 text-brand-primary" />
          Logo da empresa
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Preview da logo atual */}
          <div
            className="w-40 h-40 rounded-2xl border-2 border-dashed flex items-center
                       justify-center bg-white/5 overflow-hidden flex-shrink-0 transition-all duration-500 group relative"
            style={{ borderColor: logoAtual ? "rgb(var(--brand-primary))" : "rgba(255,255,255,0.1)" }}
          >
            {logoAtual ? (
              <>
                <img
                  src={logoAtual}
                  alt="Logo atual"
                  className="w-full h-full object-contain p-4 relative z-10"
                />
                <div className="absolute inset-0 bg-brand-primary/5 blur-xl" />
              </>
            ) : (
              <div className="text-center p-2 text-text/20">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <span className="text-[10px] uppercase font-black tracking-[0.2em]">Sem Logo</span>
              </div>
            )}
          </div>

          {/* Botões e instruções */}
          <div className="space-y-4 flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-brand-primary text-white hover:brightness-110 shadow-lg shadow-brand-primary/20"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Enviando..." : "Fazer upload da logo"}
            </Button>
            <div className="space-y-1">
              <p className="text-xs text-text/40">
                • PNG, JPG, SVG ou WebP · Máximo 2MB
              </p>
              <p className="text-xs text-text/40">
                • Recomendado: fundo transparente (PNG ou SVG)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: Nome e slogan ─────────────────────────── */}
      <section className="space-y-4 bg-card/30 p-6 rounded-2xl border border-white/5">
        <h3 className="font-bold flex items-center gap-2 text-lg">
          <Edit className="w-5 h-5 text-brand-primary" />
          Nome e slogan
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da empresa / produto</Label>
            <Input
              value={brand.nome}
              onChange={(e: any) =>
                setBrand((b) => ({ ...b, nome: e.target.value }))
              }
              placeholder="Ex: OmniVendas"
              maxLength={40}
            />
          </div>

          <div className="space-y-2">
            <Label>Slogan</Label>
            <Input
              value={brand.slogan}
              onChange={(e: any) =>
                setBrand((b) => ({ ...b, slogan: e.target.value }))
              }
              placeholder="Ex: Transforme seu WhatsApp em máquina de vendas"
              maxLength={80}
            />
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: Cores ─────────────────────────────────── */}
      <section className="space-y-4 bg-card/30 p-6 rounded-2xl border border-white/5">
        <h3 className="font-bold flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-brand-primary" />
          Cores da marca
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              key: "primary_color",
              label: "Cor principal",
              hint: "Botões e destaques",
            },
            {
              key: "secondary_color",
              label: "Cor secundária",
              hint: "Hover e bordas",
            },
            {
              key: "accent_color",
              label: "Cor de acento",
              hint: "Fundos suaves",
            },
          ].map(({ key, label, hint }) => (
            <div key={key} className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <Label className="text-xs font-black uppercase tracking-widest">{label}</Label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                  <input
                    type="color"
                    value={brand[key as keyof typeof brand] as string}
                    onChange={(e) =>
                      setBrand((b) => ({ ...b, [key]: e.target.value }))
                    }
                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-0 p-0"
                  />
                </div>
                <Input
                  value={brand[key as keyof typeof brand] as string}
                  onChange={(e: any) =>
                    setBrand((b) => ({ ...b, [key]: e.target.value }))
                  }
                  className="font-mono text-xs uppercase h-12"
                  maxLength={7}
                />
              </div>
              <p className="text-[10px] text-text/30 font-bold uppercase tracking-wider">{hint}</p>
            </div>
          ))}
        </div>

        {/* Preview das cores */}
        <div
          className="rounded-xl p-6 mt-4 flex items-center justify-between border border-white/5 relative overflow-hidden"
          style={{ background: brand.accent_color + "11" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="flex items-center gap-3 relative z-10">
            {logoAtual ? (
              <img src={logoAtual} alt="logo" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded bg-brand-primary/20" />
            )}
            <span className="font-black text-xl tracking-tighter" style={{ color: brand.primary_color }}>
              {brand.nome}
            </span>
          </div>
          <button
            className="px-6 py-2 rounded-lg text-white text-sm font-bold shadow-lg relative z-10"
            style={{ background: brand.primary_color }}
          >
            Começar agora
          </button>
        </div>
        <p className="text-[10px] text-text/40 font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
          <Search className="w-3 h-3" /> Preview em tempo real da identidade visual
        </p>
      </section>

      {/* ── BOTÃO SALVAR ─────────────────────────────────── */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-6 text-lg font-black uppercase tracking-widest bg-brand-primary text-white hover:brightness-110 shadow-xl shadow-brand-primary/20"
      >
        {saving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
        {saving ? "Salvando..." : "Salvar Configurações"}
      </Button>

    </div>
  );
}
