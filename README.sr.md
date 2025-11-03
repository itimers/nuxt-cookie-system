# 🍪 Nuxt Sistem za Saglasnost Kolačića

> 🌐 Moderan, prilagodljiv i GDPR-usklađen sistem za saglasnost kolačića napravljen sa Nuxt 3.

**📖 Srpska verzija | [English](README.md)**

---

## ✨ O Projektu

Ovaj projekat predstavlja **profesionalan sistem za saglasnost kolačića** razvijen u **Nuxt 3** sa **TypeScript-om** i **composable arhitekturom**. Sistem podržava **detaljnu kontrolu kolačića**, **privremeno čuvanje**, **zaštićene kolačiće**, **uslovni loader**, i mnoge druge napredne funkcionalnosti za GDPR usklađenost.

**Ključne prednosti:**
- 🎨 Prelep UI sa glatkim tranzicijama i animacijama
- 🔧 Detaljna kontrola nad kategorijama i pojedinačnim opcijama
- ⚡ Optimizovane performanse sa uslovnim loader sistemom
- 🎯 Pametno upravljanje stanjem sa privremenim čuvanjem
- 🌐 SSG kompatibilan i hydration-safe
- 📱 Potpuno responzivan dizajn
- ♿ Pristupačan sa ARIA oznakama

**Pametni loader** se prikazuje samo kada su kolačići prihvaćeni, poboljšavajući Lighthouse ocene performansi i pružajući bolje korisničko iskustvo.

---

## 🎯 Ključne Karakteristike

### 🎛️ **Upravljanje Kolačićima**
- ✅ Prihvati Sve / Odbij Sve brze akcije
- ✅ Zaštićeni kolačići koji ne mogu biti onemogućeni
- ✅ Kontrola na nivou kategorije (uključi/isključi cele kategorije)
- ✅ Kontrola na nivou opcije (detaljna kontrola pojedinačnih opcija)
- ✅ Trajno čuvanje (preference čuvane 1 godinu)
- ✅ Privremeno čuvanje (pregled izmena pre čuvanja)

### 🎨 **Korisnički Interfejs**
- ✅ Glatke animacije (fade i slide tranzicije)
- ✅ Prilagodljivi meni sa proširivim opcijama
- ✅ Vizuelna povratna informacija (hover, active, click animacije)
- ✅ Mobilno optimizovan responzivan dizajn
- ✅ Plutajuće dugme za brz pristup
- ✅ Gradijentne pozadine sa blur efektima

### 🛠️ **Funkcionalnosti za Developere**
- ✅ Jednostavan `is()` funkcija API za proveru kolačića
- ✅ Composable arhitektura (ponovno upotrebljiv Nuxt 3 composable)
- ✅ Potpuna TypeScript podrška i sigurnost tipova
- ✅ Laka integracija (drop-in rešenje)
- ✅ Dobro dokumentovano sa sveobuhvatnim primerima
- ✅ Optimizacija performansi na prvom mestu

### 🚀 **Performanse**
- ✅ Uslovni loader (samo kada su kolačići prihvaćeni)
- ✅ Pametno učitavanje CSS-a (dinamičko upravljanje stylesheet-ovima)
- ✅ Minimalna veličina paketa (bez teških zavisnosti)
- ✅ Brza hidracija (optimizovano za SSG/SSR)
- ✅ Lighthouse optimizovano (bolje FCP ocene)

---

## 🛠️ Tehnologije

- **Framework:** Nuxt 3 (v4.1.3)
- **Jezik:** TypeScript
- **Runtime:** Vue 3 (v3.5.22)
- **Router:** Vue Router (v4.6.3)
- **Stilizovanje:** CSS sa CSS Promenljivima
- **Font:** Poppins (Google Fonts)

**Browser API-ji:**
- 🍪 Cookie API za čuvanje preferenci
- 🎨 CSS Promenljive za dinamičko tema
- 📱 Media Queries za responzivan dizajn
- 🎭 CSS Tranzicije za animacije

---

## 📦 Instalacija

### 1️⃣ Klonirajte repozitorijum

```bash
git clone https://github.com/itimers/nuxt-cookie-system.git
cd nuxt-cookie-system/nuxt
```

### 2️⃣ Instalirajte zavisnosti

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

---

## 🚀 Pokretanje Projekta

### Development Server

Pokrenite development server na `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production Build

Napravite build aplikacije za produkciju:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Statička Generacija Sajta (SSG)

Generišite statički sajt za deployment:

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```

### Pregled Production Build-a

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

---

## 💻 Upotreba

### Osnovna Implementacija

Sistem kolačića je već integrisan u default layout. Jednostavno koristite `is()` funkciju da proverite preference kolačića:

```vue
<template>
  <div>
    <!-- Prikaži sadržaj samo ako je analytics omogućen -->
    <div v-if="is('analytics')">
      <h3>Analytics je Omogućen</h3>
      <p>Google Analytics prati ovu stranicu.</p>
    </div>

    <!-- Prikaži sadržaj samo ako je themes kolačić omogućen -->
    <ThemeSelector v-if="is('themes')" />

    <!-- Prikaži sadržaj samo ako je cela Marketing kategorija omogućena -->
    <AdsComponent v-if="is('marketing')" />
  </div>
</template>

<script setup>
const { is } = useCookies()
</script>
```

### Napredna Upotreba - Prilagođene Kategorije Kolačića

Dodajte prilagođene kategorije kolačića u `useCookies.ts`:

```typescript
const DEFAULT_COOKIES: CookieCategory[] = [
  { 
    id: 1, 
    protected: false, 
    name: 'Marketing', 
    value: false, 
    description: 'Marketing kolačići pomažu u praćenju ponašanja i poboljšanju korisničkog iskustva.', 
    options: [
      { id: 1, protected: true, name: 'Google Analytics', is: 'analytics', value: true }, 
      { id: 2, protected: false, name: 'Facebook Pixel', is: 'facebook', value: false },
      { id: 3, protected: false, name: 'TikTok Pixel', is: 'tiktok', value: false }
    ] 
  },
  { 
    id: 2, 
    protected: true, // Ne može biti onemogućen od strane korisnika
    name: 'Esencijalni', 
    value: true, 
    description: 'Esencijalni kolačići potrebni za funkcionisanje vebsajta.',
    options: [
      { id: 1, protected: true, name: 'Sesija', is: 'session', value: true },
      { id: 2, protected: true, name: 'Sigurnost', is: 'security', value: true }
    ] 
  }
]
```

### Programsko Upravljanje Kolačićima

```vue
<script setup>
const { 
  is,                      // Proveri da li je kolačić omogućen
  allCookies,             // Reaktivno stanje kolačića
  acceptAllCookies,       // Prihvati sve kolačiće
  rejectAllCookies,       // Odbij sve (osim zaštićenih)
  savePreferences,        // Sačuvaj trenutne preference
  loadSavedPreferences,   // Učitaj sačuvane preference
  isCookieDecided,        // Proveri da li je korisnik napravio izbor
  cookieStatus            // Trenutni status: 'waiting' | 'accepted' | 'rejected'
} = useCookies()

// Primer: Proveri više kolačića
const canShowAds = computed(() => {
  return is('marketing') && is('analytics')
})

// Primer: Uključi/isključi specifičan kolačić
const toggleAnalytics = () => {
  toggleCookie('analytics')
  savePreferences()
}

// Primer: Prilagođena logika prihvatanja
const acceptMarketingOnly = () => {
  allCookies.value.forEach(category => {
    if (category.name === 'Marketing') {
      category.value = true
      category.options?.forEach(opt => {
        if (!opt.protected) opt.value = true
      })
    }
  })
  savePreferences()
}
</script>
```

### Korišćenje Loader Sistema

Loader je automatski konfigurisan da se prikazuje samo kada su kolačići prihvaćeni, poboljšavajući ocene performansi:

```typescript
// U nuxt.config.ts - već konfigurisano!
app: {
  head: {
    script: [{
      innerHTML: `
        (function() {
          var cookies = document.cookie.split(';');
          var cookieAccepted = cookies.find(function(c) { 
            return c.trim().startsWith('cookie-accepted='); 
          });
          var status = cookieAccepted ? cookieAccepted.split('=')[1] : 'waiting';
          
          var style = document.createElement('style');
          if (status === 'accepted') {
            style.innerHTML = '.page-loader { display: flex; }';
          } else {
            style.innerHTML = '.page-loader { display: none; }';
          }
          document.head.appendChild(style);
        })();
      `,
      type: 'text/javascript',
    }]
  }
}
```

**Zašto ovaj pristup?**
- ⚡ **Lighthouse Optimizacija** - Sprečava nepotrebni loader pri prvoj poseti
- 🎯 **Bolje UX** - Prikazuje loader samo korisnicima koji su prihvatili kolačiće
- 🚀 **Brže Vreme Učitavanja** - Bez loader kašnjenja za nove posetioce
- 📊 **Bolje Ocene** - Poboljšava First Contentful Paint (FCP) metrike

---

## 🎛️ API Referenca

### useCookies() Composable

| Funkcija | Tip Povratne Vrednosti | Opis |
|----------|------------------------|------|
| `is(identifier)` | `boolean` | Proveri da li je specifičan kolačić/kategorija omogućena |
| `readCookies()` | `CookieCategory[] \| null` | Dobavi trenutne preference kolačića |
| `toggleCookie(cookieIs)` | `void` | Uključi/isključi specifičan kolačić |
| `loadSavedPreferences()` | `void` | Učitaj preference iz cookie skladišta |
| `acceptAllCookies()` | `void` | Prihvati sve nezaštićene kolačiće |
| `rejectAllCookies()` | `void` | Odbij sve nezaštićene kolačiće |
| `savePreferences()` | `void` | Sačuvaj trenutne preference u kolačiće |
| `manageTransitionsCSS()` | `void` | Dinamički učitaj/ukloni transition CSS |

### Reaktivno Stanje

| Svojstvo | Tip | Opis |
|----------|-----|------|
| `allCookies` | `Ref<CookieCategory[]>` | Trenutno stanje svih kolačića |
| `isCookieDecided` | `ComputedRef<boolean>` | Da li je korisnik napravio izbor |
| `isAccepted` | `ComputedRef<boolean>` | Da li su kolačići prihvaćeni |
| `cookieStatus` | `Ref<string>` | Trenutni status: 'waiting', 'accepted', ili 'rejected' |

### TypeScript Interfejsi

```typescript
interface CookieCategory {
  id: number
  protected: boolean      // Ne može biti onemogućen od strane korisnika
  name: string
  value: boolean
  description: string
  options?: CookieOption[]
}

interface CookieOption {
  id: number
  protected: boolean      // Ne može biti onemogućen od strane korisnika
  name: string
  value: boolean
  is: string             // Jedinstveni identifikator za is() provere
}
```

---

## 📁 Struktura Projekta

```
nuxt-cookie-system/nuxt/
│
├── 📂 app/
│   ├── 📂 components/
│   │   └── cookies.vue              # Cookie banner komponenta (ako je odvojena)
│   │
│   ├── 📂 composables/
│   │   └── useCookies.ts            # Glavni composable za upravljanje kolačićima
│   │
│   ├── 📂 layouts/
│   │   └── default.vue              # Default layout sa integriranim cookie sistemom
│   │
│   └── 📂 pages/
│       └── index.vue                # Početna stranica
│
├── 📂 public/
│   └── robots.txt                   # SEO robots fajl
│
├── 📄 nuxt.config.ts                # Nuxt konfiguracija sa loader skriptom
├── 📄 package.json                  # Zavisnosti i skripte
├── 📄 tsconfig.json                 # TypeScript konfiguracija
├── 📄 README.md                     # Engleska dokumentacija
└── 📄 README.sr.md                  # Srpska dokumentacija (ovaj fajl)
```

### Objašnjenje Ključnih Fajlova

#### 🎯 `app/composables/useCookies.ts`
Srce sistema kolačića. Sadrži:
- Upravljanje stanjem kolačića
- Podrazumevane kategorije i opcije kolačića
- `is()` funkciju za proveru statusa kolačića
- Accept/Reject/Save funkcije
- Logiku zaštićenih kolačića

#### 🎨 `app/layouts/default.vue`
Glavni layout fajl koji sadrži:
- Cookie banner UI
- Meni za prilagođavanje sa svim opcijama
- Sistem privremenog čuvanja kolačića
- Save/Cancel logiku
- Plutajuće dugme za podešavanja kolačića
- Vizuelnu povratnu informaciju i animacije

#### ⚙️ `nuxt.config.ts`
Konfiguracioni fajl sa:
- Inline skriptom za uslovni prikaz loader-a
- Podešavanjima na nivou aplikacije
- Head metadata

---

## 🔑 Objašnjenje Ključnih Funkcionalnosti

### 1. Sistem Privremenih Kolačića (tempCookies)

**Problem:** Korisnici su mogli slučajno da omoguće kolačiće klikom na toggle-ove, čak i pre čuvanja.

**Rešenje:** Implementiran sistem privremenog čuvanja:

```typescript
const tempCookies = ref<any>(null)

// Kada se otvara customize meni
const toggleCustomize = () => {
  if (isCustomizing.value) {
    // Napravi duboku kopiju za bezbedno editovanje
    tempCookies.value = JSON.parse(JSON.stringify(allCookies.value))
    originalPreferences.value = JSON.parse(JSON.stringify(allCookies.value))
  }
}

// Primeni samo kada korisnik klikne "Save Preferences"
const applyTempCookies = () => {
  if (tempCookies.value) {
    allCookies.value = JSON.parse(JSON.stringify(tempCookies.value))
  }
}
```

**Prednosti:**
- ✅ Pregled izmena bez njihove primene
- ✅ Otkazivanje i povratak na originalna podešavanja
- ✅ Nema slučajnog omogućavanja kolačića
- ✅ Bolji UX sa eksplicitnom akcijom čuvanja

### 2. Zaštićeni Kolačići

Neki kolačići su esencijalni i ne mogu biti onemogućeni:

```typescript
const isOptionDisabled = (cookie: any, option: any) => {
  if (option.protected) return true
  // Dodatna logika...
}
```

**UI Ponašanje:**
- 🔒 Checkbox je onemogućen
- 👁️ Vizuelna indikacija (opacity, cursor stil)
- 🏷️ "Required" oznaka
- 🎨 Različita šema boja (zelena umesto teal)

### 3. Uslovne Zavisnosti

Primer: "Device Preferred Theme" zavisi od "Themes":

```typescript
const isOptionDisabled = (cookie: any, option: any) => {
  if (option.is === 'prefers') {
    const themesOption = cookie.options?.find((opt: any) => opt.is === 'themes')
    return !themesOption?.value  // Onemogućen ako je themes isključen
  }
}
```

### 4. Logika Toggle-a Kategorije

Klik na checkbox kategorije uključuje/isključuje sve njene nezaštićene opcije:

```typescript
const toggleCategoryOptions = (cookie: any) => {
  if (!cookie.options || cookie.protected) return
  
  const isFullyChecked = isCategoryFullyChecked(cookie)
  
  cookie.options.forEach((option: any) => {
    if (!option.protected && !isOptionDisabled(cookie, option)) {
      option.value = !isFullyChecked
    }
  })
  
  checkPreferencesChanged()
}
```

### 5. Hydration-Safe Loader

**Izazov:** SSG izaziva hydration neslaganja sa renderovanjem zavisnim od kolačića.

**Rešenje:** Inline skripta u head-u koja se izvršava pre hidratacije:

```javascript
// Izvršava se sinhrono pre Vue hidratacije
var cookies = document.cookie.split(';')
var status = cookieAccepted ? cookieAccepted.split('=')[1] : 'waiting'

// Ubaci CSS baziran na statusu kolačića
if (status === 'accepted') {
  style.innerHTML = '.page-loader { display: flex; }'
} else {
  style.innerHTML = '.page-loader { display: none; }'
}
```

**Zašto ovo radi:**
- ✅ Izvršava se pre hidratacije (nema neslaganja)
- ✅ Direktno čitanje kolačića (nema reaktivnog stanja)
- ✅ CSS injekcija (nema DOM manipulacije)
- ✅ Brzo izvršavanje (inline, bez mrežnog zahteva)

---

## 🐛 Rešeni Problemi

### Problem 1: Hydration Mismatch Upozorenja
**Problem:** SSR/CSR razlike u stanju kolačića su izazivale hydration greške.

**Rešenje:** Inline skripta u `nuxt.config.ts` koja se izvršava pre Vue hidratacije, koristeći CSS injekciju umesto reaktivnog stanja.

---

### Problem 2: Trenutna Primena Kolačića
**Problem:** Toggle-ovanje kolačića u customize meniju ih je primenjivalo odmah, a ne pri čuvanju.

**Rešenje:** Implementiran `tempCookies` sistem privremenog čuvanja koji primenjuje izmene samo kada se klikne "Save Preferences".

---

### Problem 3: Nekorišćene CSS Promenljive
**Problem:** 20+ CSS promenljivih zagađivalo kod, mnoge nekorišćene.

**Rešenje:** Revidirani ceo CSS i uklonjeno 11+ nekorišćenih promenljivih, zadržano samo 9 esencijalnih:
- `--app`, `--font`, `--font-four`
- `--loader-bg`, `--loader-in`
- `--link-active`, `--green`, `--red`
- `--pag-active`, `--border`, `--hbs`

---

### Problem 4: Loše Lighthouse Ocene
**Problem:** Loader koji se prikazuje pri svakom učitavanju stranice je narušavao metrike performansi.

**Rešenje:** Uslovni loader koji se prikazuje samo kada su kolačići prihvaćeni, poboljšavajući FCP i Lighthouse ocene.

---

## 🎯 Primeri Upotrebe

### 1. E-Commerce Vebsajt
```vue
<!-- Prikaži personalizovane preporuke samo ako je praćenje omogućeno -->
<div v-if="is('analytics') && is('marketing')">
  <RecommendedProducts :userId="currentUser.id" />
</div>

<!-- Prikaži guest mod ako je praćenje onemogućeno -->
<div v-else>
  <GenericProducts />
</div>
```

### 2. Višejezička Platforma
```vue
<!-- Omogući prebacivanje jezika samo ako je locales kolačić aktivan -->
<LanguageSwitcher v-if="is('locales')" />
```

### 3. Sistem Tema
```vue
<script setup>
const { is } = useCookies()

// Inicijalizuj sistem tema samo ako je kolačić omogućen
const themeEnabled = computed(() => is('themes'))

watchEffect(() => {
  if (themeEnabled.value) {
    initializeThemeSystem()
  } else {
    setDefaultTheme()
  }
})
</script>
```

### 4. Integracija Analitike
```vue
<script setup>
const { is } = useCookies()

onMounted(() => {
  // Učitaj Google Analytics samo ako je korisnik pristao
  if (is('analytics')) {
    loadGoogleAnalytics()
  }
  
  // Učitaj Facebook Pixel samo ako je marketing omogućen
  if (is('facebook')) {
    loadFacebookPixel()
  }
})
</script>
```

### 5. Performance Funkcionalnosti
```vue
<!-- Omogući teške animacije samo ako je korisnik pristao -->
<div :class="{ 'with-animations': is('animations') }">
  <HeavyAnimatedComponent />
</div>

<!-- Lazy load slike samo ako su performance kolačići omogućeni -->
<img 
  v-if="is('blur')"
  :src="imageSrc" 
  loading="lazy"
  class="blur-load"
/>
```

---

## 📝 To-Do Lista

### Planirane Funkcionalnosti
- [ ] 🌍 Višejezična podrška za opise kolačića
- [ ] 🎨 Opcije za prilagođavanje teme
- [ ] 📊 Analytics dashboard za stope prihvatanja kolačića
- [ ] 🔔 Obaveštenja o ažuriranjima politike kolačića
- [ ] 💾 Export/Import profila preferenci
- [ ] 🔐 Poboljšane sigurnosne opcije
- [ ] 📱 Integracija sa mobilnom aplikacijom
- [ ] 🎯 A/B testiranje za cookie UI
- [ ] 📈 Statistika korišćenja kolačića
- [ ] 🔌 Plugin sistem za prilagođene integracije

### Poboljšanja
- [ ] ♿ Poboljšana pristupačnost (WCAG 2.1 AAA)
- [ ] 🎭 Više presetova animacija
- [ ] 📦 NPM paket za laku instalaciju
- [ ] 🎨 CSS prilagođavanje kroz props
- [ ] 📖 Video tutorijali
- [ ] 🧪 Pokrivenost unit testovima
- [ ] 📊 Performance benchmark-ovi

---

## 📄 Licenca

Ovaj projekat je licenciran pod **MIT Licencom**.

```
MIT Licenca

Copyright (c) 2025 ITimers

Dozvola se ovim daje, besplatno, svakom licu koje dobije kopiju
ovog softvera i povezanih fajlova dokumentacije ("Softver"), da se
bavi Softverom bez ograničenja, uključujući bez ograničenja prava
da koristi, kopira, modifikuje, spaja, objavljuje, distribuira, 
sublicencira i/ili prodaje kopije Softvera, i da dozvoli licima 
kojima se Softver pruža da to čine, pod sledećim uslovima:

Gornje obaveštenje o autorskim pravima i ovo obaveštenje o dozvoli 
treba da budu uključeni u sve kopije ili značajne delove Softvera.

SOFTVER SE PRUŽA "KAKAV JESTE", BEZ GARANCIJE BILO KOJE VRSTE, 
IZRIČITE ILI IMPLICITNE, UKLJUČUJUĆI ALI NE OGRANIČAVAJUĆI SE NA 
GARANCIJE TRŽIŠNOSTI, PODOBNOSTI ZA ODREĐENU SVRHU I NEPOVREDE. 
NI U KOM SLUČAJU AUTORI ILI NOSIOCI AUTORSKIH PRAVA NEĆE BITI 
ODGOVORNI ZA BILO KAKVE ZAHTEVE, ŠTETU ILI DRUGU ODGOVORNOST, 
BILO U RADNJI UGOVORA, DELIKTA ILI NA DRUGI NAČIN, PROIZAŠLOM IZ, 
IZ ILI U VEZI SA SOFTVEROM ILI UPOTREBOM ILI DRUGIM POSLOVIMA U SOFTVERU.
```

---

## 👨‍💻 Autor

**ITimers**

- 🌐 Vebsajt: [Uskoro]
- 📧 Email: [Kontakt Informacije]
- 💼 GitHub: [@itimers](https://github.com/itimers)
- 🐦 Twitter: [Vaš Twitter]

---

## 🤝 Doprinos

Doprinosi su dobrodošli! Evo kako možete pomoći:

### Kako Doprineti

1️⃣ **Fork-ujte repozitorijum**
```bash
git clone https://github.com/itimers/nuxt-cookie-system.git
```

2️⃣ **Napravite feature branch**
```bash
git checkout -b feature/neverovatna-funkcionalnost
```

3️⃣ **Napravite svoje izmene**
- Pišite čist, dokumentovan kod
- Pratite postojeći stil koda
- Dodajte komentare za kompleksnu logiku
- Temeljno testirajte svoje izmene

4️⃣ **Commit-ujte svoje izmene**
```bash
git commit -m "Dodato: Neverovatna nova funkcionalnost"
```

5️⃣ **Push-ujte na vaš fork**
```bash
git push origin feature/neverovatna-funkcionalnost
```

6️⃣ **Otvorite Pull Request**
- Jasno opišite svoje izmene
- Referenciraite povezane issue-e
- Dodajte screenshot-ove ako je primenjivo

### Smernice za Doprinos

- ✅ Pratite TypeScript najbolje prakse
- ✅ Održavajte konzistentan stil koda
- ✅ Dodajte JSDoc komentare za nove funkcije
- ✅ Testirajte na više browser-a
- ✅ Ažurirajte dokumentaciju
- ✅ Budite poštovani i konstruktivni

### Prijave Bagova

Našli ste bag? Molimo otvorite issue sa:
- 🐛 Jasnim opisom baga
- 📋 Koracima za reprodukciju
- 💻 Očekivanim vs stvarnim ponašanjem
- 🖼️ Screenshot-ovima ako je primenjivo
- 🌐 Browser i OS informacijama

---

## 💬 Podrška

Potrebna vam je pomoć? Evo gde je možete dobiti:

### Podrška Zajednice
- 💬 [GitHub Discussions](https://github.com/itimers/nuxt-cookie-system/discussions) - Postavljajte pitanja, delite ideje
- 🐛 [GitHub Issues](https://github.com/itimers/nuxt-cookie-system/issues) - Prijavite bagove, zahtevajte funkcionalnosti
- 📧 Email: [Vaš Support Email]

### Dokumentacija
- 📖 [Engleski README](./README.md) - Sveobuhvatan vodič
- 🇷🇸 [Srpski README](./README.sr.md) - Dokumentacija na srpskom (ovaj fajl)
- 💻 [Komentari Koda](./app/composables/useCookies.ts) - Inline dokumentacija

### Resursi
- 🎓 [Nuxt 3 Dokumentacija](https://nuxt.com/) - Naučite Nuxt 3
- 🍪 [Najbolje Prakse za Kolačiće](https://gdpr.eu/cookies/) - GDPR usklađenost
- ♿ [Smernice za Pristupačnost](https://www.w3.org/WAI/WCAG21/quickref/) - WCAG standardi

---

## ⭐ Pokažite Vašu Podršku

Ako vam je ovaj projekat pomogao, razmislite o:

- ⭐ Dodavanju zvezde repozitorijumu
- 🐛 Prijavljivanju bagova
- 💡 Predlaganju novih funkcionalnosti
- 🤝 Doprinosu kodom
- 📢 Deljenju sa drugima

---

## 🙏 Zahvalnice

Posebne zahvalnice:

- 💚 **Nuxt Timu** - Za neverovatni framework
- 🎨 **Vue.js Timu** - Za reaktivnu magiju
- 🍪 **GDPR Ekspertima** - Za smernice o usklađenosti kolačića
- 🌟 **Open Source Zajednici** - Za inspiraciju i podršku
- 💼 **Saradnicima** - Za činjenje ovog projekta boljim

---

<div align="center">

**Napravljeno sa ❤️ od strane ITimers**

⭐ **Dodajte zvezdu ovom repo-u** ako vam je koristan!

[Prijavite Bag](https://github.com/itimers/nuxt-cookie-system/issues) · 
[Zahtevajte Funkcionalnost](https://github.com/itimers/nuxt-cookie-system/issues) · 
[Dokumentacija](./README.sr.md)

</div>
