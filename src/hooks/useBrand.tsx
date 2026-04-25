import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../supabase";

export interface BrandConfig {
  nome: string;
  slogan: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

const DEFAULT_BRAND: BrandConfig = {
  nome: "OmniVendas",
  slogan: "Transforme seu WhatsApp em máquina de vendas",
  logo_url: "",
  primary_color: "#F97316",
  secondary_color: "#EA580C",
  accent_color: "#FED7AA",
};

// --- Context global para evitar múltiplas queries ao Supabase ---
export const BrandContext = createContext<{
  brand: BrandConfig;
  loading: boolean;
  reload: () => void;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
}>({
  brand: DEFAULT_BRAND,
  loading: true,
  reload: () => {},
  setBrand: () => {},
});

// --- Helper for hex to RGB ---
function hexToRgb(hex: string) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return "249 115 22"; // Fallback to orange if something goes wrong
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

// --- Provider: colocar UMA VEZ no App.tsx ou main.tsx ---
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "brand")
        .single();

      if (error) {
        console.warn("[BrandProvider] Erro ao buscar brand:", error.message);
        setLoading(false);
        return;
      }

      if (data?.value) {
        const merged = { ...DEFAULT_BRAND, ...data.value };
        setBrand(merged);

        // Aplicar variáveis CSS globalmente
        document.documentElement.style.setProperty(
          "--brand-primary", hexToRgb(merged.primary_color)
        );
        document.documentElement.style.setProperty(
          "--brand-secondary", hexToRgb(merged.secondary_color)
        );
        document.documentElement.style.setProperty(
          "--brand-accent", hexToRgb(merged.accent_color)
        );

        // Atualizar título da página
        document.title = `${merged.nome} — ${merged.slogan}`;
      }
    } catch (err) {
      console.warn("[BrandProvider] Falha na requisição:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <BrandContext.Provider value={{ brand, loading, reload: load, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

// --- Hook de consumo: usar em qualquer componente ---
export function useBrand() {
  return useContext(BrandContext);
}
