# Contexto do Projeto - Builderfy AI

## Visão Geral
O projeto **Builderfy AI** é uma landing page e um painel administrativo voltado para a comercialização de um sistema de atendimento via WhatsApp baseado em Inteligência Artificial. 

Anteriormente focado no usuário final (OmniVendas), o projeto passou por um pivô estratégico em Abril de 2026 para se tornar uma **Plataforma de Revenda White Label**.

## Objetivo do Negócio
O objetivo atual é atrair parceiros que queiram vender tecnologia sob sua própria marca. A oferta principal é o **Painel de Revenda**, vendido por uma anuidade de **R$ 150,00**.

## Público-Alvo
- Agências de Marketing.
- Consultores de Vendas.
- Empreendedores Digitais.
- Pessoas que buscam renda extra recorrente com baixo investimento inicial.

## Arquitetura do Sistema
- **Landing Page (App.tsx):** Totalmente focada em conversão para o modelo de revenda, incluindo simulador de lucros e captura de leads.
- **Painel Administrativo (Admin.tsx):** Onde o "Dono da Marca" (Administrador) gerencia os leads e as configurações globais.
- **Personalização (PersonalizacaoTab.tsx):** Permite que o sistema mude de "cara" (White Label), alterando nome e logo de forma dinâmica.
- **Hooks (useBrand.tsx):** Sincroniza a identidade visual em toda a plataforma.

## Fluxo de Leads
1. O interessado preenche Nome e WhatsApp na Landing Page.
2. Os dados são salvos no Supabase (Tabela `leads`).
3. O lead é redirecionado para o WhatsApp do proprietário (+55 22 99215-7330) com uma mensagem pré-definida.

## Próximos Passos
- Implementar checkout direto para a anuidade de R$ 150.
- Expandir as funcionalidades do Painel de Revenda para controle automatizado de licenças.
- Adicionar materiais de marketing (Assets) para download dentro do painel administrativo.
