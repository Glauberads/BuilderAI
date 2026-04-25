import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  User, 
  MessageSquare,
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Check, 
  X, 
  Menu, 
  ChevronDown, 
  Star, 
  ArrowRight,
  LayoutGrid,
  Rocket,
  ShieldCheck,
  RefreshCw,
  Bot
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

const WhatsAppMockup = () => {
  const { brand } = useBrand();
  const messages = [
    { type: 'received', text: 'Olá! Gostaria de saber mais sobre o produto.', time: '14:02' },
    { type: 'sent', text: `Olá! Sou o assistente IA da ${brand.nome}. 😊\nComo posso te ajudar hoje?`, time: '14:02' },
    { type: 'received', text: 'Vocês têm integração com CRM?', time: '14:03' },
    { type: 'sent', text: 'Sim! Integramos com Salesforce, RD Station e muitos outros. Gostaria de agendar uma demonstração?', time: '14:03' },
    { type: 'received', text: 'Sim, por favor!', time: '14:04' },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < messages.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, messages.length]);

  return (
    <div className="w-full max-w-[400px] h-[500px] glass rounded-[2.5rem] p-4 relative overflow-hidden border-4 border-[#1A1A2E] shadow-2xl">
      {/* Header */}
      <div className="bg-[#1A1A2E] p-4 -mx-4 -mt-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-background">
          <User size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold">Assistente {brand.nome.split(' ')[0]}</h4>
          <p className="text-[10px] text-brand-primary font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="space-y-4 overflow-y-auto h-[380px] pr-2 custom-scrollbar">
        <AnimatePresence>
          {messages.slice(0, visibleCount).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.type === 'sent' ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={cn(
                "max-w-[80%] p-3 rounded-2xl text-sm relative",
                msg.type === 'sent' 
                  ? "bg-brand-primary text-background ml-auto rounded-tr-none" 
                  : "bg-white/10 text-text rounded-tl-none"
              )}
            >
              {msg.text}
              <span className={cn(
                "text-[10px] block mt-1",
                msg.type === 'sent' ? "text-background/60" : "text-text/40"
              )}>
                {msg.time}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/5 rounded-full p-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full" />
        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-background">
          <ArrowRight size={16} />
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

const PricingCard = ({ title, price, features, recommended }: { title: string, price: string, features: string[], recommended?: boolean, annual: boolean }) => {
  const { openModal } = useLead();
  return (
    <div className={cn(
    "p-8 rounded-3xl transition-all duration-500 relative",
    recommended 
      ? "bg-card border-2 border-brand-primary shadow-[0_0_40px_rgba(249,115,22,0.15)] scale-105 z-10" 
      : "bg-card/50 border border-white/10 hover:border-white/20"
  )}>
    {recommended && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-background px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
        Recomendado
      </span>
    )}
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl font-black">R$ {price}</span>
      <span className="text-text/50">/mês</span>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-text/80">
          <Check size={16} className="text-brand-primary flex-shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={openModal}
      className={cn(
        "w-full py-4 rounded-xl font-bold transition-all",
        recommended ? "bg-brand-primary text-background" : "bg-white/10 hover:bg-white/20"
      )}
    >
      Escolher Plano
    </button>
  </div>
  );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-brand-primary transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
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
          source: window.location.href 
        }
      ]);

      if (error) throw error;

      toast.success("Sucesso! Redirecionando...");
      
      // WhatsApp redirect
      const message = encodeURIComponent(`Olá, me chamo ${data.nome} e gostaria de saber mais!`);
      const phone = "5511999999999"; // Exemplo, deveria ser o número do cliente
      window.location.href = `https://wa.me/${phone}?text=${message}`;

      closeModal();
      reset();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar contato. Tente novamente.");
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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[480px] bg-card/80 border border-white/10 rounded-[2rem] p-10 shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-primary/10 blur-3xl -z-10" />

            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-text/40 hover:text-text hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-background mb-6 shadow-xl shadow-brand-primary/20 rotate-3">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-3">Falar com Especialista</h2>
              <p className="text-text/60 leading-relaxed">
                Você está a um passo de automatizar suas vendas. Preencha os dados e receba uma demonstração gratuita.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text/40 ml-1">Seu Nome</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text/20 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input
                    {...register("nome")}
                    placeholder="Como podemos te chamar?"
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300",
                      errors.nome ? "border-red-500/50" : "border-white/10"
                    )}
                  />
                </div>
                {errors.nome && <p className="text-xs text-red-500 ml-1 font-medium">{errors.nome.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-text/40 ml-1">Seu WhatsApp</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-text/20 group-focus-within:text-brand-primary transition-colors" size={18} />
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
                      "w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300",
                      errors.whatsapp ? "border-red-500/50" : "border-white/10"
                    )}
                  />
                </div>
                {errors.whatsapp && <p className="text-xs text-red-500 ml-1 font-medium">{errors.whatsapp.message}</p>}
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-16 bg-brand-primary text-background rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin" size={24} />
                ) : (
                  <>Receber Demonstração <ArrowRight size={20} /></>
                )}
              </button>
            </form>
            
            <p className="text-center text-[10px] text-text/30 mt-8 font-medium uppercase tracking-[0.1em]">
              🔒 Seus dados estão seguros e não enviamos spam.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---

export default function App() {
  const { brand, loading } = useBrand();
  const { openModal } = useLead();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pricingAnnual, setPricingAnnual] = useState(true);
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname.toLowerCase() === '/admin' || 
    window.location.pathname.toLowerCase() === '/admin/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdmin(
        window.location.pathname.toLowerCase() === '/admin' || 
        window.location.pathname.toLowerCase() === '/admin/'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isAdmin) {
    return <Admin />;
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePricingToggle = () => {
    setPricingAnnual(!pricingAnnual);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-brand-primary selection:text-background">
      <Toaster position="top-right" />
      <LeadCaptureModal />
      {/* 1. NAVBAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass border-b border-white/5 py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            {loading ? (
              <div className="w-32 h-8 rounded bg-white/5 animate-pulse" />
            ) : brand.logo_url ? (
              <img 
                src={brand.logo_url} 
                alt={brand.nome} 
                className="h-24 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const span = document.createElement("span");
                  span.textContent = brand.nome;
                  span.className = "text-2xl font-black tracking-tighter";
                  span.style.color = "rgb(var(--brand-primary))";
                  target.parentNode?.appendChild(span);
                }}
              />
            ) : (
              <span className="text-2xl font-black tracking-tighter" style={{ color: "rgb(var(--brand-primary))" }}>
                {brand.nome}
              </span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-link">Funcionalidades</a>
            <a href="#how-it-works" className="nav-link">Como funciona</a>
            <a href="#pricing" className="nav-link">Preços</a>
            <a href="#testimonials" className="nav-link">Depoimentos</a>
            <button 
              onClick={openModal}
              className="border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background px-6 py-2 rounded-lg font-bold transition-all"
            >
              Começar grátis
            </button>
          </div>

          <button 
            className="md:hidden text-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass mt-4 rounded-2xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.nome} className="h-16 w-auto object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-brand-primary">{brand.nome}</span>
                  )}
                </div>
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium hover:text-brand-primary transition-colors">Funcionalidades</a>
                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium hover:text-brand-primary transition-colors">Como funciona</a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium hover:text-brand-primary transition-colors">Preços</a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium hover:text-brand-primary transition-colors">Depoimentos</a>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); openModal(); }} 
                  className="w-full btn-primary mt-4"
                >
                  Começar grátis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Radial Background Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold"
            >
              <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-ping" />
              🤖 Agente IA para WhatsApp — Novo
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              {brand.nome} no seu WhatsApp
            </h1>
            
            <p className="text-xl text-text/60 leading-relaxed max-w-xl">
              {brand.slogan}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={openModal} className="btn-primary flex items-center justify-center gap-2">
                Testar grátis por 7 dias <ArrowRight size={20} />
              </button>
              <button onClick={openModal} className="btn-secondary">
                Enviar mensagem
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
              <div>
                <div className="text-2xl font-bold">3x mais</div>
                <div className="text-sm text-text/40">Leads convertidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-text/40">Sem parar</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+500</div>
                <div className="text-sm text-text/40">Empresas</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <WhatsAppMockup />
          </div>
        </div>
      </section>

      {/* 3. PROBLEMA -> SOLUÇÃO */}
      <Section className="bg-card/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">O problema</h2>
              <div className="space-y-6">
                {[
                  "Leads esperam horas por uma resposta e desistem",
                  "Equipe sobrecarregada com perguntas repetitivas",
                  "Vendas perdidas no final de semana e feriados"
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                      <X size={20} />
                    </div>
                    <p className="text-lg text-text/80">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-brand-primary">A Solução {brand.nome}</h2>
              <div className="space-y-6">
                {[
                  "Resposta instantânea em segundos, 24 horas por dia",
                  "Triagem automática: a IA filtra e qualifica cada lead",
                  "Sua empresa nunca para: feche vendas até enquanto dorme"
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                      <Check size={20} />
                    </div>
                    <p className="text-lg text-text/80">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. FUNCIONALIDADES */}
      <Section id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">Tudo o que você precisa para escalar</h2>
            <p className="text-xl text-text/60">Recursos poderosos desenhados para aumentar sua conversão e produtividade.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Resposta Instantânea"
              description="Nossa IA responde em segundos, mantendo o lead aquecido no momento de maior interesse."
            />
            <FeatureCard 
              icon={Target}
              title="Qualificação de Leads"
              description="Perguntas estratégicas para separar curiosos de compradores reais automaticamente."
            />
            <FeatureCard 
              icon={LayoutGrid}
              title="Integração com CRM"
              description="Sincronize todos os dados e conversas diretamente com seu CRM favorito via Webhook."
            />
            <FeatureCard 
              icon={Users}
              title="Multi-atendentes"
              description="Distribua leads entre sua equipe humana quando a IA terminar a qualificação."
            />
            <FeatureCard 
              icon={Bot}
              title="Personalização de Tom"
              description="Configure a personalidade da IA para falar exatamente como sua marca."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Relatórios em Tempo Real"
              description="Dashboard completo com métricas de conversão, tempo de resposta e ROI."
            />
          </div>
        </div>
      </Section>

      {/* 5. COMO FUNCIONA (Stepper) */}
      <Section id="how-it-works" className="bg-card/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Comece em menos de 5 minutos</h2>
            <p className="text-text/60">Simples, rápido e sem complicações técnicas.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-4">
            <Step 
              number={1}
              title="Conecte seu WhatsApp"
              description="Escaneie o QR Code como no WhatsApp Web e pronto."
            />
            <Step 
              number={2}
              title="Configure o Agente"
              description="Dê as instruções e informações sobre seus produtos."
            />
            <Step 
              number={3}
              title="Ative e Receba"
              description="A IA começa a responder seus leads instantaneamente."
            />
            <Step 
              number={4}
              title="Acompanhe Resultados"
              description="Veja suas vendas crescerem no dashboard."
              isLast
            />
          </div>
        </div>
      </Section>

      {/* 6. PROVA SOCIAL */}
      <Section id="testimonials">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Empresas que já vendem no piloto automático</h2>
          <div className="flex justify-center gap-1 text-yellow-400 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            <span className="text-text ml-2 font-bold">4.9/5 de avaliação</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Ricardo Mendes",
                role: "CEO na TechVendas",
                text: `A ${brand.nome} triplicou nossa taxa de resposta. Não perdemos mais nenhum lead nos finais de semana.`,
                img: "https://i.pravatar.cc/150?u=1"
              },
              {
                name: "Ana Julia Lima",
                role: "Marketing na SolarPro",
                text: "A qualificação automática é incrível. Nossa equipe agora só foca nos leads que realmente querem comprar.",
                img: "https://i.pravatar.cc/150?u=2"
              },
              {
                name: "Bruno Costa",
                role: "Dono da MoveisLux",
                text: "Parece mágica. A IA responde exatamente como eu responderia, com o tom de voz perfeito da nossa loja.",
                img: "https://i.pravatar.cc/150?u=3"
              }
            ].map((t, i) => (
              <div key={i} className="glass p-8 rounded-3xl space-y-6">
                <p className="text-lg italic text-text/80">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-brand-primary/30" />
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-text/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale">
            {/* Mock logos */}
            <div className="text-2xl font-black tracking-tighter">APPLE</div>
            <div className="text-2xl font-black tracking-tighter">SAMSUNG</div>
            <div className="text-2xl font-black tracking-tighter">TESLA</div>
            <div className="text-2xl font-black tracking-tighter">META</div>
            <div className="text-2xl font-black tracking-tighter">ADIDAS</div>
            <div className="text-2xl font-black tracking-tighter">NIKE</div>
          </div>
        </div>
      </Section>

      {/* 7. PRICING */}
      <Section id="pricing" className="bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Planos que crescem com você</h2>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium", !pricingAnnual ? "text-text" : "text-text/40")}>Mensal</span>
              <button 
                onClick={handlePricingToggle}
                className="w-14 h-8 rounded-full bg-brand-primary/20 p-1 flex items-center transition-all"
              >
                <motion.div 
                  animate={{ x: pricingAnnual ? 24 : 0 }}
                  className="w-6 h-6 bg-brand-primary rounded-full"
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", pricingAnnual ? "text-text" : "text-text/40")}>Anual</span>
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-bold">-20%</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            <PricingCard 
              title="Starter"
              price={pricingAnnual ? "157" : "197"}
              features={[
                "Até 500 leads/mês",
                "1 número de WhatsApp",
                "Personalidade básica",
                "Integração via Webhook",
                "Suporte via e-mail"
              ]}
              annual={pricingAnnual}
            />
            <PricingCard 
              recommended
              title="Pro"
              price={pricingAnnual ? "317" : "397"}
              features={[
                "Leads ilimitados",
                "3 números de WhatsApp",
                "Personalidade avançada",
                "Integração nativa CRM",
                "Relatórios avançados",
                "Suporte prioritário"
              ]}
              annual={pricingAnnual}
            />
            <PricingCard 
              title="Enterprise"
              price={pricingAnnual ? "637" : "797"}
              features={[
                "Números ilimitados",
                "IA personalizada treinada",
                "API dedicada",
                "Gerente de conta exclusivo",
                "SLA de 99.9%",
                "Customização total"
              ]}
              annual={pricingAnnual}
            />
          </div>
        </div>
      </Section>

      {/* 8. FAQ */}
      <Section id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          <div className="space-y-2">
            <AccordionItem 
              question="Preciso deixar meu celular ligado?"
              answer="Não! A nossa IA roda diretamente na nuvem. Depois de conectar, você pode até desligar seu aparelho que o agente continuará respondendo 24/7."
            />
            <AccordionItem 
              question="A IA consegue enviar fotos e PDFs?"
              answer="Sim! Você pode configurar o agente para enviar catálogos, fotos de produtos e documentos informativos durante a conversa."
            />
            <AccordionItem 
              question="Posso usar meu número atual?"
              answer="Sim, você pode conectar qualquer número de WhatsApp, seja pessoal ou Business."
            />
            <AccordionItem 
              question="Corro risco de banimento?"
              answer="Utilizamos tecnologia que simula o comportamento humano (digitação, pausas, horários), o que reduz drasticamente os riscos, seguindo as melhores práticas do mercado."
            />
            <AccordionItem 
              question="Como funciona a garantia?"
              answer="Oferecemos 7 dias de teste grátis e, após a assinatura, você tem 7 dias de garantia incondicional de satisfação ou seu dinheiro de volta."
            />
            <AccordionItem 
              question="Quais CRMs vocês integram?"
              answer="Integramos nativamente com RD Station, HubSpot, Salesforce e via Webhook/Zapier com qualquer ferramenta do mercado."
            />
          </div>
        </div>
      </Section>

      {/* 9. CTA FINAL */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] text-center border-brand-primary/20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8">Pronto para vender enquanto você dorme?</h2>
            <p className="text-xl text-text/60 mb-12 max-w-2xl mx-auto">
              Junte-se a mais de 500 empresas que automatizaram seu atendimento e viram suas conversões dispararem.
            </p>
            
            <div className="max-w-lg mx-auto mb-6">
              <button 
                onClick={openModal}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-xl"
              >
                Começar agora <Rocket size={24} />
              </button>
            </div>
            <p className="text-sm text-text/40 flex items-center justify-center gap-2">
              <ShieldCheck size={16} /> Sem cartão de crédito. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 10. FOOTER */}
      {/* Floating WhatsApp Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={openModal}
        className="fixed bottom-8 right-8 z-[90] bg-brand-primary text-background p-4 rounded-full shadow-lg shadow-brand-primary/40 flex items-center gap-2 font-bold group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 whitespace-nowrap">
          Falar no WhatsApp
        </span>
        <MessageSquare size={28} />
      </motion.button>

      <footer className="bg-card py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.nome} className="h-16 w-auto object-contain" />
              ) : (
                <span className="text-xl font-bold text-brand-primary">{brand.nome}</span>
              )}
            </div>
            <p className="text-text/50 text-sm leading-relaxed">
              O agente de IA mais inteligente para automação de vendas via WhatsApp. Desenvolvido para escalar seu negócio.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-primary">Produto</h4>
            <ul className="space-y-4 text-sm text-text/50">
              <li><a href="#features" className="hover:text-brand-primary">Funcionalidades</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-primary">Como funciona</a></li>
              <li><a href="#pricing" className="hover:text-brand-primary">Preços</a></li>
              <li><a href="#testimonials" className="hover:text-brand-primary">Depoimentos</a></li>

            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-primary">Empresa</h4>
            <ul className="space-y-4 text-sm text-text/50">
              <li><a href="#" className="hover:text-brand-primary">Sobre nós</a></li>
              <li><a href="#" className="hover:text-brand-primary">Carreiras</a></li>
              <li><a href="#" className="hover:text-brand-primary">Blog</a></li>
              <li><a href="/admin" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="hover:text-brand-primary">Painel Admin</a></li>
              <li><a href="#" className="hover:text-brand-primary">Contato</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-primary">Social</h4>
            <ul className="space-y-4 text-sm text-text/50">
              <li><a href="#" className="hover:text-brand-primary">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-primary">LinkedIn</a></li>
              <li><a href="#" className="hover:text-brand-primary">YouTube</a></li>
              <li><a href="#" className="hover:text-brand-primary">Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text/30">
          <p>© 2024 {brand.nome}. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
