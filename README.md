# Convite de aniversário

Site-convite para o meu aniversário. Em vez de um texto genérico no WhatsApp, cada convidado abre uma página com a cara do evento: data, mapa, calendário e confirmação de presença.

Também entra no portfólio como um produto pequeno, ponta a ponta — da abertura do convite até o RSVP.

**Quando:** sábado, 7 de novembro de 2026, 12h  
**Onde:** Nova Suíça, Goiânia — GO

## O que o convite faz

- Abertura com splash antes de entrar na página
- Data, horário e endereço em um layout próprio
- Mapa interativo (Leaflet) e atalhos para Google Maps, Waze e Apple Maps
- Adicionar o evento ao calendário (Google, Outlook, `.ics`)
- Formulário de RSVP persistido no Supabase
- Painel em `/admin` para acompanhar as confirmações

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 e Tailwind CSS 4
- [Supabase](https://supabase.com) para as confirmações
- [Leaflet](https://leafletjs.com) / react-leaflet no mapa
- Deploy na [Vercel](https://vercel.com)

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). O painel de confirmações fica em `/admin`.

Variáveis locais (arquivo `.env.local`, não versionado):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Na Vercel, configure as mesmas chaves do Supabase no projeto. Sem elas o site sobe, mas o RSVP não grava.

## Deploy

Cada push em `master` gera um deploy de produção. O gerenciador de pacotes no ambiente da Vercel é o padrão do Next.js (`npm`); localmente o fluxo continua com `pnpm`.
