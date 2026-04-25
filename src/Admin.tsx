import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  Link as LinkIcon, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Download,
  Filter,
  MoreVertical,
  ChevronRight,
  Save,
  Globe,
  Code,
  Link,
  User,
  RefreshCw,
  AlertCircle,
  Layout,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PersonalizacaoTab } from './components/admin/PersonalizacaoTab';
import { useBrand } from './hooks/useBrand';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Lead {
  id: string;
  created_at: string;
  nome: string;
  whatsapp: string;
  source: string;
  status: 'new' | 'contacted' | 'concluded';
}

interface MarketingSettings {
  social_links: {
    instagram: string;
    facebook: string;
    whatsapp: string;
    youtube: string;
  };
  scripts: {
    facebook_pixel: string;
    google_analytics: string;
    custom_head: string;
  };
}

interface IntegrationSettings {
  webhook_url: string;
  api_key: string;
  auto_sync: boolean;
}

// --- Subcomponents ---

const DashboardCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <div className="bg-card/30 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-500">
    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl -z-10 group-hover:bg-brand-primary/10 transition-colors" />
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform duration-500">
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {trend}
        </span>
      )}
    </div>
    <p className="text-text/40 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</p>
    <h3 className="text-3xl font-black tracking-tight">{value}</h3>
  </div>
);

// --- Modules ---

const LeadsModule = () => {
  const { brand } = useBrand();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar leads');
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'WhatsApp', 'Data', 'Origem', 'Status'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.nome}"`,
        `"${lead.whatsapp}"`,
        `"${new Date(lead.created_at).toLocaleDateString()}"`,
        `"${lead.source || '-'}"`,
        `"${lead.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `leads_${brand.nome.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.whatsapp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Leads</h2>
          <p className="text-text/40 text-sm">Visualize e gerencie todos os seus contatos capturados.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Download size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total de Leads" value={leads.length.toString()} icon={Users} trend="+12% este mês" />
        <DashboardCard title="Novos Hoje" value={leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length.toString()} icon={Plus} />
        <DashboardCard title="Conversão" value="24.8%" icon={BarChart3} />
      </div>

      <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou número..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand-primary transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-text/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Lead / Identificação</th>
                <th className="px-6 py-5">WhatsApp</th>
                <th className="px-6 py-5">Data de Captura</th>
                <th className="px-6 py-5">Status Atual</th>
                <th className="px-6 py-5 text-right">Gerenciar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-brand-primary" size={32} />
                    <p className="text-text/40">Carregando leads...</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-text/40">Nenhum lead encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-xs shadow-inner">
                          {lead.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold tracking-tight">{lead.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text/60 font-mono text-sm">{lead.whatsapp}</td>
                    <td className="px-6 py-4 text-text/60 text-sm">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        lead.status === 'new' ? "bg-blue-500/10 text-blue-500" :
                        lead.status === 'contacted' ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-brand-primary/10 text-brand-primary"
                      )}>
                        {lead.status === 'new' ? 'Novo' : lead.status === 'contacted' ? 'Contatado' : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-text/40 group-hover:text-text">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MarketingModule = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<MarketingSettings>({
    social_links: {
      instagram: '',
      facebook: '',
      whatsapp: '',
      youtube: ''
    },
    scripts: {
      facebook_pixel: '',
      google_analytics: '',
      custom_head: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'marketing')
      .single();

    if (data) {
      setSettings(data.value);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'marketing', value: settings });

    if (error) {
      toast.error('Erro ao salvar configurações');
    } else {
      toast.success('Configurações salvas com sucesso!');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Marketing & Tracking</h2>
        <p className="text-text/40 text-sm">Gerencie seus links sociais e pixels de rastreamento.</p>
      </div>

      <div className="grid gap-8">
        {/* Social Links */}
        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -z-10" />
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-2 rounded-xl bg-brand-primary/10">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Presença Digital</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(settings.social_links).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text/40">{key}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, [key]: e.target.value }
                    })}
                    placeholder={`https://${key}.com/...`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                  />
                  <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-text/20" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Scripts */}
        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -z-10" />
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-2 rounded-xl bg-brand-primary/10">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Rastreamento & Conversão</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text/40">Facebook Pixel ID</label>
              <input 
                type="text" 
                value={settings.scripts.facebook_pixel}
                onChange={(e) => setSettings({
                  ...settings,
                  scripts: { ...settings.scripts, facebook_pixel: e.target.value }
                })}
                placeholder="Ex: 1234567890"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text/40">Google Analytics ID</label>
              <input 
                type="text" 
                value={settings.scripts.google_analytics}
                onChange={(e) => setSettings({
                  ...settings,
                  scripts: { ...settings.scripts, google_analytics: e.target.value }
                })}
                placeholder="Ex: G-XXXXXXXXXX"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text/40">Custom Header Code</label>
              <textarea 
                rows={4}
                value={settings.scripts.custom_head}
                onChange={(e) => setSettings({
                  ...settings,
                  scripts: { ...settings.scripts, custom_head: e.target.value }
                })}
                placeholder="<script>...</script>"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-mono h-32"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-background rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

const IntegrationsModule = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<IntegrationSettings>({
    webhook_url: '',
    api_key: '',
    auto_sync: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'integrations')
      .single();

    if (data) {
      setSettings(data.value);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'integrations', value: settings });

    if (error) {
      toast.error('Erro ao salvar integrações');
    } else {
      toast.success('Integrações salvas com sucesso!');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Integrações & Webhooks</h2>
        <p className="text-text/40 text-sm">Conecte a sua plataforma com seu CRM ou automações externas.</p>
      </div>

      <div className="grid gap-8">
        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -z-10" />
          <div className="flex items-center gap-3 text-brand-primary">
            <div className="p-2 rounded-xl bg-brand-primary/10">
              <Link size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Fluxo de Dados (Webhook)</h3>
          </div>
          <p className="text-sm text-text/60">
            Enviaremos todos os dados de novos leads para esta URL em formato JSON via POST.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text/40">Webhook URL</label>
              <input 
                type="text" 
                value={settings.webhook_url}
                onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                placeholder="https://sua-api.com/webhook"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text/40">API Secret Key (Opcional)</label>
              <input 
                type="password" 
                value={settings.api_key}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                placeholder="Suas-chave-secreta"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setSettings({ ...settings, auto_sync: !settings.auto_sync })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.auto_sync ? "bg-brand-primary" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  settings.auto_sync ? "left-7" : "left-1"
                )} />
              </button>
              <span className="text-sm font-medium">Sincronização Automática Ativada</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
          <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-blue-500 mb-1">Dica de Integração</h4>
            <p className="text-sm text-text/60 leading-relaxed">
              Você pode usar ferramentas como Make.com ou Zapier para conectar este webhook com mais de 5.000 aplicativos, incluindo Google Sheets, RD Station e Salesforce.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-background rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Component ---

export default function Admin() {
  const { brand } = useBrand();
  const [activeTab, setActiveTab] = useState<'leads' | 'marketing' | 'integrations' | 'personalizacao'>('leads');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error('Credenciais inválidas');
    } else {
      setUser(data.user);
      toast.success('Bem-vindo de volta!');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Sessão encerrada');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center text-background mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <User size={32} />
            </div>
            <h1 className="text-3xl font-black mb-2">Painel Admin</h1>
            <p className="text-text/40">Entre para gerenciar sua máquina de vendas.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text/60">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                placeholder={`admin@${brand.nome.toLowerCase()}.com`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text/60">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button 
              disabled={authLoading}
              type="submit"
              className="w-full py-4 bg-brand-primary text-background rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? <RefreshCw className="animate-spin" size={20} /> : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text flex">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-white/5 flex flex-col p-6 fixed inset-y-0 hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.nome} className="h-12 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center text-background">
              <User size={24} />
            </div>
          )}
          <span className="text-xl font-black">{brand.nome}</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('leads')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'leads' ? "bg-brand-primary text-background" : "text-text/60 hover:bg-white/5 hover:text-text"
            )}
          >
            <Users size={20} /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('personalizacao')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'personalizacao' ? "bg-brand-primary text-background" : "text-text/60 hover:bg-white/5 hover:text-text"
            )}
          >
            <Layout size={20} /> Personalização
          </button>
          <button 
            onClick={() => setActiveTab('marketing')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'marketing' ? "bg-brand-primary text-background" : "text-text/60 hover:bg-white/5 hover:text-text"
            )}
          >
            <BarChart3 size={20} /> Marketing
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'integrations' ? "bg-brand-primary text-background" : "text-text/60 hover:bg-white/5 hover:text-text"
            )}
          >
            <Link size={20} /> Integrações
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2 text-text/40 text-sm">
              <span>Home</span>
              <ChevronRight size={14} />
              <span className="text-text capitalize">{activeTab}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.email}</p>
                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Settings size={20} className="text-text/40" />
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'leads' && <LeadsModule />}
              {activeTab === 'personalizacao' && <PersonalizacaoTab />}
              {activeTab === 'marketing' && <MarketingModule />}
              {activeTab === 'integrations' && <IntegrationsModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
