# ASD La Spotornese — Sito ufficiale

Sito web istituzionale della **ASD La Spotornese – Società di Pesca Sportiva**:
presentazione della società, eventi e gare, news, gallerie fotografiche e
un pannello di amministrazione per aggiornare i contenuti senza toccare il
codice.

Questo documento spiega, in ordine, tutto quello che serve per capire,
eseguire, pubblicare e mantenere il sito.

---

## Indice

1. [Architettura del progetto](#1-architettura-del-progetto)
2. [Tecnologie utilizzate](#2-tecnologie-utilizzate)
3. [Struttura del database](#3-struttura-del-database)
4. [Autenticazione amministratore](#4-autenticazione-amministratore)
5. [Gestione immagini](#5-gestione-immagini)
6. [Gestione eventi](#6-gestione-eventi)
7. [Gestione news](#7-gestione-news)
8. [Struttura delle pagine](#8-struttura-delle-pagine)
9. [Come avviare il progetto in locale](#9-come-avviare-il-progetto-in-locale)
10. [Come effettuare il deploy online](#10-come-effettuare-il-deploy-online)
11. [Come aggiornare e modificare il sito](#11-come-aggiornare-e-modificare-il-sito)
12. [Placeholder da sostituire](#12-placeholder-da-sostituire)
13. [Sicurezza](#13-sicurezza)
14. [Possibili espansioni future](#14-possibili-espansioni-future)

---

## 1. Architettura del progetto

Il sito è composto da tre parti che lavorano insieme:

- **Applicazione web (Next.js)** — genera tutte le pagine pubbliche e il
  pannello di amministrazione. Gira sia lato server (per SEO e velocità)
  sia lato client (per le parti interattive: menu mobile, gallerie,
  calendario, form).
- **Database e autenticazione (Supabase)** — un database Postgres ospitato
  in cloud, con un sistema di login integrato e uno spazio per archiviare
  le immagini caricate. Le regole di sicurezza (Row Level Security) sono
  scritte direttamente nel database: chiunque può *leggere* i contenuti
  pubblicati, ma solo l'amministratore autenticato può crearli, modificarli
  o eliminarli.
- **Hosting (Vercel)** — la piattaforma dove il sito viene pubblicato.
  Ottimizzata per Next.js, con piano gratuito adeguato al traffico previsto
  per questo sito.

Non esiste un "server" da amministrare: tutto è gestito da questi servizi
cloud, quindi non ci sono aggiornamenti di sistema, patch di sicurezza del
server o backup manuali di cui preoccuparsi.

## 2. Tecnologie utilizzate

| Livello | Tecnologia | Perché |
|---|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, React 19, TypeScript) | Standard moderno, ottimo per SEO, pagine veloci, molto diffuso (facile trovare aiuto/sviluppatori in futuro) |
| Stile | [Tailwind CSS v4](https://tailwindcss.com) | Design coerente, responsive "di serie", facile da modificare |
| Database + Auth + Storage | [Supabase](https://supabase.com) (Postgres) | Tutto-in-uno, piano gratuito generoso, open source, nessun vendor lock-in (è Postgres standard) |
| Ottimizzazione immagini | [sharp](https://sharp.pixelplumbing.com) | Ridimensiona e comprime automaticamente le foto caricate |
| Hosting | [Vercel](https://vercel.com) | Creato dallo stesso team di Next.js, piano gratuito, deploy automatico |

Il codice è organizzato in TypeScript per ridurre gli errori, ed è
commentato nei punti meno immediati.

## 3. Struttura del database

Il database (Postgres, tramite Supabase) contiene queste tabelle
principali (schema completo e commentato in
`supabase/migrations/0001_init.sql`):

- **`events`** — eventi e gare (titolo, data, orario, luogo, descrizione,
  stato, galleria collegata, immagine di copertina).
- **`news`** — comunicazioni (titolo, testo, immagine, in evidenza sì/no).
- **`galleries`** — gallerie fotografiche (titolo, descrizione, evento
  collegato).
- **`images`** — singole immagini caricate (appartengono a una galleria,
  con titolo/descrizione/testo alternativo).
- **`attachments`** — documenti PDF collegati a un evento o a una news
  (es. regolamenti).
- **`site_content`** — testi delle pagine modificabili dal pannello
  (sottotitolo Home, storia della società, informazioni di contatto…).
- **`admins`** — elenco degli utenti abilitati ad amministrare il sito.

Ogni tabella ha delle regole (**Row Level Security**) che permettono a
chiunque di leggere i contenuti pubblicati, ma solo agli utenti presenti
nella tabella `admins` di crearne, modificarne o eliminarne.

## 4. Autenticazione amministratore

Il login (`/admin/login`) usa **Supabase Auth** (email + password).
Dopo il login, il sistema verifica che l'utente sia effettivamente
presente nella tabella `admins`: se non lo è, viene disconnesso
automaticamente. Questo doppio controllo (autenticazione + autorizzazione)
impedisce che un account Supabase qualunque possa accedere al pannello.

Tutte le pagine sotto `/admin/*` sono protette da un middleware
(`middleware.ts`) che reindirizza al login chiunque non sia autenticato
come amministratore. Le stesse regole sono applicate anche a livello di
database (RLS), quindi anche in caso di errore nel codice dell'interfaccia,
nessuno potrebbe comunque scrivere dati senza essere un amministratore
riconosciuto.

**Per creare il primo utente amministratore**, vedi la sezione
[Deploy](#10-come-effettuare-il-deploy-online).

## 5. Gestione immagini

Dal pannello (`/admin/galleria`), l'amministratore può:

- creare una galleria (eventualmente collegata a un evento);
- caricare più immagini contemporaneamente, con anteprima prima
  dell'invio;
- aggiungere titolo, descrizione e testo alternativo a ogni immagine;
- impostare l'immagine di copertina della galleria;
- sostituire o eliminare una singola immagine in qualsiasi momento.

Ogni immagine caricata viene **ottimizzata automaticamente** lato server
(vedi `src/lib/image-processing.ts`): viene ridimensionata se troppo
grande (max 2000px di larghezza) e convertita in formato WebP, che è più
leggero mantenendo una buona qualità visiva. Questo evita che il sito
diventi lento per foto troppo pesanti caricate da smartphone.

Sul sito pubblico, le gallerie sono mostrate con un layout a griglia
moderno e si aprono a schermo intero (lightbox) al click, con navigazione
tra le foto.

L'upload è riservato esclusivamente all'amministratore autenticato: sia
l'interfaccia sia le regole del database (RLS sul bucket "media") lo
impediscono a chiunque altro.

## 6. Gestione eventi

Dal pannello (`/admin/eventi`), l'amministratore può creare, modificare ed
eliminare eventi con: titolo, descrizione, data, orario, data di fine (per
eventi su più giorni), luogo, stato, informazioni aggiuntive, immagine di
copertina, galleria fotografica collegata e documenti/regolamenti (PDF).

**Lo stato "Prossimo" / "Concluso" è automatico**: si calcola da solo in
base alla data odierna (vedi `getEffectiveStatus` in `src/lib/utils.ts`).
Un evento resta "Prossimo" per tutta la giornata in cui si svolge (o fino
alla data di fine, per eventi su più giorni) e diventa "Concluso" a
partire dal giorno successivo — l'amministratore non deve mai aggiornarlo
a mano. L'unico stato impostabile manualmente dal modulo è "Annullato",
da usare quando una manifestazione non si svolgerà: ha sempre la
precedenza sul calcolo automatico. Un evento concluso resta comunque
visibile nella scheda "Conclusi" finché l'amministratore non lo elimina
esplicitamente (nessuna cancellazione automatica).

Sul sito pubblico, gli eventi sono mostrati sia in **elenco** (con filtro
prossimi/conclusi/tutti) sia in **vista calendario**, e ogni evento ha una
propria pagina di dettaglio con URL leggibile (es. `/eventi/gara-sociale-2026`).

## 7. Gestione news

Dal pannello (`/admin/news`), l'amministratore può creare, modificare ed
eliminare comunicazioni con: titolo, riassunto breve, testo completo,
immagine, allegati e possibilità di metterle "in evidenza" (mostrate per
prime nella pagina News e nella Home).

## 8. Struttura delle pagine

Pagine pubbliche (cartella `src/app/(site)/`):

- `/` — Home (hero, attività, prossimi eventi, ultime news, anteprima
  galleria, contatti)
- `/la-societa` — presentazione e storia della società
- `/attivita` — attività proposte dall'associazione
- `/eventi` — elenco/calendario eventi, `/eventi/[slug]` per il dettaglio
- `/news` — elenco comunicazioni, `/news/[slug]` per il dettaglio
- `/galleria` — elenco gallerie, `/galleria/[slug]` per la singola galleria
- `/contatti` — indirizzo, mappa, email, telefono, social

Area amministrativa (cartella `src/app/admin/`), protetta da login:

- `/admin` — dashboard con azioni rapide
- `/admin/eventi`, `/admin/news`, `/admin/galleria` — elenchi e gestione
- `/admin/contenuti` — testi modificabili delle pagine
- `/admin/contatti` — informazioni di contatto

## 9. Come avviare il progetto in locale

Richiede [Node.js](https://nodejs.org) 20 o superiore.

```bash
npm install
cp .env.example .env.local   # poi compila le variabili (vedi sezione Deploy)
npm run dev
```

Il sito sarà visibile su `http://localhost:3000`. Senza le variabili
Supabase reali, le pagine funzionano comunque ma mostrano "nessun
contenuto" al posto di eventi/news/immagini.

## 10. Come effettuare il deploy online

### 10.1 Creare il progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un account gratuito.
2. Crea un nuovo progetto (scegli una regione europea, es. Frankfurt).
3. Vai su **SQL Editor** e incolla ed esegui il contenuto del file
   `supabase/migrations/0001_init.sql` (crea tutte le tabelle e le regole
   di sicurezza).
4. Facoltativo: esegui anche `supabase/migrations/0002_seed.sql` per avere
   qualche contenuto di esempio da subito.
5. Vai su **Project Settings → API**: copia l'`URL` del progetto e la
   chiave `anon public`.

### 10.2 Creare l'utente amministratore

1. Nel progetto Supabase, vai su **Authentication → Users → Add user** e
   crea un utente con la tua email e una password sicura.
2. Copia l'`ID` di quell'utente (colonna UID).
3. Torna su **SQL Editor** ed esegui:
   ```sql
   insert into public.admins (user_id, full_name)
   values ('INCOLLA-QUI-L-ID-UTENTE', 'Nome Cognome');
   ```
4. Da questo momento, quell'account può accedere a `/admin/login`.

### 10.3 Pubblicare il sito su Vercel

1. Carica il progetto su una repository GitHub (privata o pubblica).
2. Vai su [vercel.com](https://vercel.com), crea un account gratuito e
   collega la repository ("New Project" → seleziona la repository).
3. Nella schermata di configurazione, aggiungi le **Environment
   Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → l'URL del progetto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → la chiave anon pubblica
   - `NEXT_PUBLIC_SITE_URL` → l'indirizzo finale del sito (es.
     `https://www.laspotornese.it`)
4. Premi **Deploy**. Dopo qualche minuto il sito sarà online su un
   indirizzo tipo `spotornese.vercel.app`.

### 10.4 Collegare il dominio personalizzato

1. Registra il dominio (es. `laspotornese.it`) presso un registrar
   italiano (Register.it, Aruba, ecc. — di solito 10-15 €/anno).
2. Su Vercel, vai su **Project → Settings → Domains** e aggiungi il tuo
   dominio: Vercel mostrerà i record DNS da configurare presso il
   registrar (di solito bastano 2 righe da copiare/incollare).
3. Dopo la propagazione DNS (di solito entro qualche ora), il sito sarà
   raggiungibile dal dominio definitivo, con HTTPS attivato
   automaticamente.

Da quel momento, ogni volta che il codice sorgente viene aggiornato (vedi
sotto), Vercel pubblica automaticamente la nuova versione in pochi minuti.

## 11. Come aggiornare e modificare il sito

### Contenuti (uso quotidiano — nessuna competenza tecnica richiesta)

Accedi a `https://[il-tuo-dominio]/admin/login` con le tue credenziali.
Da lì puoi creare/modificare/eliminare eventi, news, immagini e gallerie,
e aggiornare i testi delle pagine e i contatti — tutto dall'interfaccia,
senza toccare codice.

### Informazioni "fisse" del sito (nome, indirizzo, social, ecc.)

Alcuni dati di base sono nel file `src/lib/constants.ts` (contrassegnati
con placeholder come `[INSERIRE ...]`). Modificarli richiede di editare
questo file e ripubblicare il sito (con Vercel collegato a GitHub, basta
salvare le modifiche sulla repository: il deploy avviene da solo). In
alternativa, indirizzo, email, telefono e social possono anche essere
aggiornati direttamente dal pannello (`/admin/contatti`) senza toccare il
codice.

### Modifiche più strutturali (nuove sezioni, grafica, funzionalità)

Richiedono modifiche al codice sorgente (cartella `src/`). Il progetto è
organizzato in modo modulare:

- `src/app/(site)/` — pagine pubbliche
- `src/app/admin/` — pannello di amministrazione
- `src/components/` — componenti riutilizzabili (organizzati per area:
  `ui`, `layout`, `events`, `news`, `gallery`, `admin`, `home`)
- `src/lib/` — logica di accesso ai dati, utilità, tipi
- `src/actions/` — operazioni di scrittura sul database (creazione,
  modifica, eliminazione)

## 12. Placeholder da sostituire

Questi contenuti sono attualmente segnaposto e vanno sostituiti con le
informazioni reali della ASD La Spotornese (in `src/lib/constants.ts`,
salvo diversa indicazione):

- Indirizzo, email, telefono, codice fiscale/P.IVA (anche modificabili da
  `/admin/contatti`)
- Storia della società e missione (anche modificabili da
  `/admin/contenuti`)
- Link ai social network
- Logo (attualmente sostituito da un'icona generica nella navbar)
- Fotografia hero della Home (attualmente uno sfondo a gradiente)
- Descrizioni delle attività proposte
- Eventi e news di esempio inseriti da `0002_seed.sql` (da eliminare dal
  pannello una volta inseriti i contenuti reali)

## 13. Sicurezza

- L'area `/admin` è protetta da autenticazione (Supabase Auth) **e** da
  un controllo di autorizzazione (tabella `admins`), sia lato applicazione
  (middleware) sia lato database (Row Level Security).
- Gli utenti pubblici possono solo **leggere** i contenuti pubblicati: le
  policy del database impediscono qualunque scrittura da parte di utenti
  non amministratori, indipendentemente da eventuali bug dell'interfaccia.
- Gli upload sono limitati a immagini e PDF, con una dimensione massima
  per file (15 MB) impostata a livello di bucket Supabase.
- Le pagine `/admin/*` sono escluse dall'indicizzazione dei motori di
  ricerca (`robots.txt` e meta tag `noindex`).

## 14. Possibili espansioni future

Il progetto è stato strutturato per poter aggiungere in futuro, senza
dover riscrivere il sito:

- più amministratori (basta aggiungere righe alla tabella `admins`);
- iscrizione online agli eventi;
- moduli di contatto;
- risultati e classifiche delle gare;
- documenti/regolamenti generali (non solo per singolo evento);
- sezione sponsor;
- notifiche email per nuove pubblicazioni;
- area riservata agli associati.

---

Per qualsiasi dubbio su questo progetto, questo README e i commenti nel
codice sorgente sono il primo riferimento.
