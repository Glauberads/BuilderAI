// Deploy trigger: complete pivot to White Label Reseller model
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Zap, 
  Users, 
  Check, 
  X, 
  Menu, 
  ChevronDown, 
  ArrowRight,
  Rocket,
  RefreshCw,
  DollarSign,
  Briefcase,
  Monitor,
  Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from './supabase';
import { useLead } from './LeadContext';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Admin from './Admin';
import { useBrand } from './hooks/useBrand';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Subcomponents ---

const Section = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} ref={ref} className={cn("py-20 px-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

const ResellerSimulation = () => {
  const [clients, setClients] = useState(10);
  const pricePerClient = 97;
  const monthlyRevenue = clients * pricePerClient;

  return (
    <div className="w-full max-w-4xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] -z-10" />
      
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black mb-4">Simule seu Lucro Recorrente</h3>
        <p className="text-text/60">Arraste para ver quanto você pode faturar vendendo assinaturas mensais.</p>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="text-sm font-black uppercase tracking-widest text-brand-primary">Quantidade de Clientes</label>
            <span className="text-4xl font-black text-white">{clients}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={clients} 
            onChange={(e) => setClients(parseInt(e.target.value))}
            className="w-full h-3 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-primary border border-white/10"
          />
          <div className="flex justify-between text-[10px] font-bold text-text/40 uppercase tracking-widest">
            <span>1 Cliente</span>
            <span>100 Clientes</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-2">Mensalidade Sugerida</p>
            <div className="text-3xl font-black">R$ {pricePerClient},00</div>
            <p className="text-[10px] text-text/30 mt-2 italic">Você define seu preço e sua margem.</p>
          </div>
          <div className="p-6 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
            <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">Sua Receita Mensal</p>
            <div className="text-4xl font-black text-brand-primary">R$ {monthlyRevenue.toLocaleString('pt-BR')},00</div>
            <p className="text-[10px] text-brand-primary/60 mt-2 font-bold uppercase tracking-widest">Lucro 100% Recorrente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group p-8 rounded-2xl bg-card border border-white/5 hover:border-brand-primary/30 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-text/60 leading-relaxed">{description}</p>
  </motion.div>
);

const Step = ({ number, title, description, isLast }: { number: number, title: string, description: string, isLast?: boolean }) => (
  <div className="flex flex-col items-center text-center relative flex-1">
    {!isLast && (
      <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-white/10">
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="w-full h-full bg-brand-primary origin-left transition-transform duration-1000 delay-500"
        />
      </div>
    )}
    <div className="w-16 h-16 rounded-full bg-brand-primary text-background flex items-center justify-center text-2xl font-black mb-6 z-10 relative shadow-[0_0_20px_rgba(249,115,22,0.3)]">
      {number}
    </div>
    <h4 className="text-lg font-bold mb-2">{title}</h4>
    <p className="text-text/60 text-sm max-w-[200px]">{description}</p>
  </div>
);

const PricingCard = () => {
  const { openModal } = useLead();
  return (
    <div className="max-w-md mx-auto p-10 rounded-[3rem] bg-card border-2 border-brand-primary shadow-[0_0_60px_rgba(249,115,22,0.2)] relative scale-105 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl -z-10" />
      <span className="absolute top-6 right-8 bg-brand-primary text-background px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Oferta de Lançamento
      </span>
      
      <h3 className="text-2xl font-black mb-2">Painel de Revenda</h3>
      <p className="text-text/40 text-sm mb-8">Sua operação SaaS completa hoje.</p>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-text/40 text-lg line-through">R$ 997</span>
        <span className="text-5xl font-black text-white">R$ 150</span>
        <span className="text-brand-primary font-bold">/ano</span>
      </div>
      <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-10">
        Menos de R$ 0,42 por dia
      </p>

      <ul className="space-y-5 mb-10">
        {[
          "Plataforma 100% White Label",
          "Sua Marca e Seu Domínio",
          "Crie Clientes Ilimitados",
          "Defina seus próprios preços",
          "Painel de Controle Adm",
          "Sem taxas por venda",
          "Hospedagem inclusa",
          "Suporte Prioritário"
        ].map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-text/80">
            <Check size={18} className="text-brand-primary flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button 
        onClick={openModal}
        className="w-full py-5 rounded-2xl bg-brand-primary text-background font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
      >
        Quero meu painel agora
      </button>
      
      <p className="text-center text-[10px] text-text/30 mt-6 font-bold uppercase tracking-widest">
        Pagamento único anual · Acesso imediato
      </p>
    </div>
  );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-brand-primary transition-colors"
      >
        <span className="text-lg font-bold">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const leadSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido: (11) 99999-9999"),
});

type LeadFormData = z.infer<typeof leadSchema>;

const LeadCaptureModal = () => {
  const { isOpen, closeModal } = useLead();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([
        { 
          nome: data.nome, 
          whatsapp: data.whatsapp, 
          source: 'Reseller Inquiry' 
        }
      ]);

      if (error) throw error;

      toast.success("Reserva confirmada! Redirecionando...");
      
      const message = encodeURIComponent(`Olá, tenho interesse no Painel de Revenda Builderfy AI! Me chamo ${data.nome}.`);
      const phone = "5522992157330"; 
      window.location.href = `https://wa.me/${phone}?text=${message}`;

      closeModal();
      reset();
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[480px] bg-card/80 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl -z-10" />

            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-text/40 hover:text-text hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-background mb-6 shadow-xl shadow-brand-primary/20">
                <Briefcase size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-3">Iniciar Minha Revenda</h2>
              <p className="text-text/60 text-sm">
                Preencha os dados abaixo para garantir sua licença do Painel de Revenda Builderfy AI com valor promocional.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text/40 ml-1">Nome Completo</label>
                <input
                  {...register("nome")}
                  placeholder="Seu nome"
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300",
                    errors.nome ? "border-red-500/50" : "border-white/10"
                  )}
                />
                {errors.nome && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.nome.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text/40 ml-1">WhatsApp de Contato</label>
                <input
                  {...register("whatsapp")}
                  placeholder="(00) 00000-0000"
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 11) value = value.slice(0, 11);
                    let masked = value;
                    if (value.length > 0) masked = "(" + value;
                    if (value.length > 2) masked = "(" + value.slice(0, 2) + ") " + value.slice(2);
                    if (value.length > 7) masked = "(" + value.slice(0, 2) + ") " + value.slice(2, 7) + "-" + value.slice(7);
                    e.target.value = masked;
                    setValue("whatsapp", masked, { shouldValidate: true });
                  }}
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300",
                    errors.whatsapp ? "border-red-500/50" : "border-white/10"
                  )}
                />
                {errors.whatsapp && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.whatsapp.message}</p>}
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-16 bg-brand-primary text-background rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={24} /> : "Garantir Meu Painel"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---

export default function App() {
  const { loading } = useBrand();
  const { openModal } = useLead();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname.toLowerCase() === '/admin' || 
    window.location.pathname.toLowerCase() === '/admin/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdmin(window.location.pathname.toLowerCase() === '/admin' || window.location.pathname.toLowerCase() === '/admin/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return <Admin />;

  return (
    <div className="min-h-screen bg-background selection:bg-brand-primary selection:text-background">
      <Toaster position="top-right" />
      <LeadCaptureModal />
      
      {/* NAVBAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass border-b border-white/5 py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            {loading ? (
              <div className="w-32 h-8 rounded bg-white/5 animate-pulse" />
            ) : (
              <span className="text-2xl font-black tracking-tighter text-brand-primary">
                Builderfy <span className="text-white">AI</span>
              </span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#opportunity" className="nav-link">Oportunidade</a>
            <a href="#how-it-works" className="nav-link">Como Ganhar</a>
            <a href="#simulation" className="nav-link">Simulação</a>
            <a href="#pricing" className="nav-link">Preço</a>
            <button 
              onClick={openModal}
              className="bg-brand-primary text-background px-6 py-2 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20"
            >
              Abrir Revenda
            </button>
          </div>

          <button className="md:hidden text-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[140px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-[0.2em]"
          >
            🚀 Oportunidade SaaS White Label
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black leading-[1] tracking-tighter max-w-5xl mx-auto">
            Tenha seu próprio SaaS com IA e fature com <span className="text-brand-primary">Receita Recorrente</span>
          </h1>
          
          <p className="text-xl text-text/60 leading-relaxed max-w-3xl mx-auto">
            Receba uma plataforma completa White Label para personalizar com sua marca, vender para seus clientes e monetizar mensalmente. Sem precisar programar uma única linha de código.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-6 justify-center">
            <button onClick={openModal} className="btn-primary h-16 px-10 text-lg flex items-center justify-center gap-3">
              Quero meu painel de revenda <ArrowRight size={22} />
            </button>
          </div>

          <div className="pt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40">
            <div className="flex items-center gap-2"><Check size={16} className="text-brand-primary" /><span className="text-sm font-bold uppercase tracking-widest">Sua Marca</span></div>
            <div className="flex items-center gap-2"><Check size={16} className="text-brand-primary" /><span className="text-sm font-bold uppercase tracking-widest">100% Recorrente</span></div>
            <div className="flex items-center gap-2"><Check size={16} className="text-brand-primary" /><span className="text-sm font-bold uppercase tracking-widest">Zero Código</span></div>
          </div>
        </div>
      </section>

      {/* POR QUE REVENDA? */}
      <Section id="opportunity" className="bg-card/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">O mercado de IA está explodindo. <span className="text-brand-primary">Não seja apenas um usuário, seja o dono.</span></h2>
            <p className="text-lg text-text/60 leading-relaxed">
              Enquanto milhões de pessoas pagam por ferramentas de IA, um grupo seleto está lucrando alto revendendo essas soluções sob sua própria marca. O Builderfy AI entrega a você a chave desse cofre.
            </p>
            <div className="space-y-4">
              {[
                { title: "Marca Própria (White Label)", desc: "Personalize logos, cores e nomes. O sistema é seu." },
                { title: "Preço sob seu controle", desc: "Você decide quanto cobrar. O lucro é 100% seu." },
                { title: "Escalabilidade Infinita", desc: "Venda 10 ou 1000 licenças com a mesma facilidade." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-text/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] -z-10" />
             <div className="glass p-1 rounded-[2.5rem] border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                  alt="Dashboard White Label" 
                  className="rounded-[2.4rem] w-full shadow-2xl"
                />
             </div>
          </div>
        </div>
      </Section>

      {/* COMO GANHAR DINHEIRO */}
      <Section id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Como você constrói sua fortuna</h2>
            <p className="text-text/60">Um modelo de negócio simplificado em 5 passos.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <Step number={1} title="Adquira o Painel" description="Garanta sua licença Builderfy AI por um custo simbólico." />
            <Step number={2} title="Sua Marca" description="Coloque seu logo e defina sua identidade visual." />
            <Step number={3} title="Venda Licenças" description="Ofereça para empresas locais ou negócios online." />
            <Step number={4} title="Defina o Preço" description="Cobre R$ 97, R$ 197 ou R$ 497 por mês de cada cliente." />
            <Step number={5} title="Lucre Recorrente" description="Veja as mensalidades caírem direto na sua conta." isLast />
          </div>
        </div>
      </Section>

      {/* SIMULAÇÃO */}
      <Section id="simulation" className="bg-brand-primary/5">
        <div className="max-w-7xl mx-auto">
          <ResellerSimulation />
        </div>
      </Section>

      {/* BENEFÍCIOS DO PAINEL */}
      <Section>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Monitor}
            title="Painel Administrativo"
            description="Gerencie todos os seus clientes em uma única interface intuitiva e poderosa."
          />
          <FeatureCard 
            icon={Shield}
            title="Hospedagem Inclusa"
            description="Não se preocupe com servidores. Nós cuidamos de toda a infraestrutura técnica."
          />
          <FeatureCard 
            icon={DollarSign}
            title="Lucro Direto"
            description="O pagamento do seu cliente vai direto para você. Não cobramos comissão por venda."
          />
          <FeatureCard 
            icon={Zap}
            title="Setup Instantâneo"
            description="Sua plataforma fica pronta para revenda em minutos após a ativação."
          />
          <FeatureCard 
            icon={Users}
            title="Suporte ao Revendedor"
            description="Treinamentos e materiais de marketing para te ajudar a vender mais rápido."
          />
          <FeatureCard 
            icon={Rocket}
            title="Atualizações Constantes"
            description="Sua plataforma sempre atualizada com as melhores tecnologias de IA do mercado."
          />
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Investimento Mínimo, <span className="text-brand-primary">Escalabilidade Máxima</span></h2>
            <p className="text-xl text-text/60 max-w-2xl mx-auto">
              Você está a um passo de ter sua própria operação de tecnologia. Escolha o caminho da recorrência.
            </p>
          </div>
          <PricingCard />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-card/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            <AccordionItem 
              question="Preciso saber programar?" 
              answer="Absolutamente não. A plataforma Builderfy AI é entregue pronta para uso. Você só precisa configurar sua marca no painel administrativo e começar a vender." 
            />
            <AccordionItem 
              question="O que significa White Label?" 
              answer="Significa que você pode remover todo o nosso nome e logomarca do sistema e substituir pelos seus. Para o seu cliente final, o sistema foi desenvolvido por você." 
            />
            <AccordionItem 
              question="Quanto eu posso lucrar?" 
              answer="O lucro é ilimitado. Como você paga apenas uma anuidade fixa para nós, todo valor que você cobrar do seu cliente (mensal ou anual) é lucro 100% seu." 
            />
            <AccordionItem 
              question="Como recebo os pagamentos?" 
              answer="Você utiliza seu próprio método de recebimento (Pix, Stripe, Mercado Pago, etc). O cliente paga diretamente para você, nós não intermediamos as transações." 
            />
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
             <span className="text-2xl font-black tracking-tighter text-brand-primary">
                Builderfy <span className="text-white">AI</span>
              </span>
              <p className="text-sm text-text/40 max-w-xs">Democratizando o acesso ao mercado de SaaS com IA através do modelo de revenda white label.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm font-bold text-text/60 hover:text-brand-primary transition-colors">Termos de Uso</a>
            <a href="#" className="text-sm font-bold text-text/60 hover:text-brand-primary transition-colors">Privacidade</a>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold">© 2026 Builderfy AI</p>
             <p className="text-[10px] text-text/40 uppercase tracking-widest mt-1">Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
