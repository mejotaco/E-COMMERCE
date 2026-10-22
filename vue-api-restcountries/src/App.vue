<template>
  <div class="app">

    <!-- ═══════════════════ ENCABEZADO ═══════════════════ -->
    <header class="hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">REST Countries API · Vue 3</p>
        <h1 class="hero-title">Explorador<br /><em>de Países</em></h1>
        <p v-if="!cargando && !error" class="hero-contador">
          {{ paisesFiltrados.length }} de {{ paises.length }} países
        </p>
      </div>
    </header>

    <!-- ═══════════════════ CONTROLES ═══════════════════ -->
    <section class="controles">
      <div class="controles-inner">

        <!-- Campo de búsqueda — v-model -->
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.6"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <input
            v-model="busqueda"
            type="search"
            placeholder="Busca un país por nombre…"
            class="search-input"
            aria-label="Buscar país"
          />
          <!-- Botón limpiar búsqueda — v-if -->
          <button
            v-if="busqueda.length > 0"
            @click="busqueda = ''"
            class="search-clear"
            aria-label="Limpiar búsqueda"
          >✕</button>
        </div>

        <!-- Filtro por región — v-model -->
        <select v-model="regionFiltro" class="region-select" aria-label="Filtrar por región">
          <option value="">Todas las regiones</option>
          <option v-for="region in regiones" :key="region" :value="region">
            {{ region }}
          </option>
        </select>

      </div>
    </section>

    <!-- ═══════════════════ ESTADOS ═══════════════════ -->
    <main class="main">

      <!-- Estado: cargando — v-if -->
      <div v-if="cargando" class="estado estado-carga" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <p>Cargando países…</p>
      </div>

      <!-- Estado: error — v-else-if -->
      <div v-else-if="error" class="estado estado-error" role="alert">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 7v5M12 16h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <p>No fue posible obtener los datos de la API</p>
        <small>{{ error }}</small>
        <button class="btn-reintentar" @click="cargarPaises">Reintentar</button>
      </div>

      <!-- Estado: sin resultados — v-else-if -->
      <div v-else-if="paisesFiltrados.length === 0" class="estado estado-vacio">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M16.5 16.5L20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8.5 13.5c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>Sin resultados para <strong>"{{ busqueda }}"</strong></p>
        <button class="btn-reintentar" @click="busqueda = ''">Ver todos</button>
      </div>

      <!-- ═══════ LISTA DE PAÍSES — v-else + v-for ═══════ -->
      <div v-else class="grid">
        <CountryCard
          v-for="pais in paisesFiltrados"
          :key="pais.cca3"
          :pais="pais"
        />
      </div>

    </main>

    <!-- ═══════════════════ PIE DE PÁGINA ═══════════════════ -->
    <footer class="footer">
      <p>
        Datos de
        <a href="https://restcountries.com" target="_blank" rel="noopener">REST Countries</a>
        · Vue 3 + Vite
      </p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CountryCard from './components/CountryCard.vue'

// ── Variables reactivas ───────────────────────────────────────────
const paises      = ref([])    // todos los países de la API
const busqueda    = ref('')    // texto del campo de búsqueda (v-model)
const regionFiltro = ref('')   // región seleccionada (v-model)
const cargando    = ref(false) // indicador de carga
const error       = ref(null)  // mensaje de error

// ── Computed: lista de regiones únicas para el <select> ───────────
const regiones = computed(() => {
  const set = new Set(paises.value.map(p => p.region).filter(Boolean))
  return [...set].sort()
})

// ── Computed: países filtrados por nombre y región ────────────────
const paisesFiltrados = computed(() => {
  const texto  = busqueda.value.toLowerCase().trim()
  const region = regionFiltro.value

  return paises.value.filter(pais => {
    const coincideNombre = pais.name.common.toLowerCase().includes(texto)
    const coincideRegion = region === '' || pais.region === region
    return coincideNombre && coincideRegion
  })
})

// ── Función para consumir la API con fetch() ──────────────────────
async function cargarPaises() {
  cargando.value = true
  error.value    = null

  try {
    const url = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,cca3'
    const respuesta = await fetch(url)

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status} ${respuesta.statusText}`)
    }

    const datos = await respuesta.json()
    // Ordenar alfabéticamente por nombre común
    paises.value = datos.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    )
  } catch (err) {
    error.value = err.message
  } finally {
    cargando.value = false
  }
}

// ── onMounted: primera llamada a la API ───────────────────────────
onMounted(() => {
  cargarPaises()
})
</script>

<style>
/* ───────────────────────────────────────────────────────────────
   TOKENS DE DISEÑO
   Tema: atlas nocturno — azules profundos, tipografía clásica
─────────────────────────────────────────────────────────────── */
:root {
  --bg:          #0C1824;
  --surface:     #112030;
  --card:        #162940;
  --card-hover:  #1C3450;
  --accent:      #4A9FD5;
  --accent-dim:  rgba(74, 159, 213, 0.14);
  --accent-glow: rgba(74, 159, 213, 0.25);
  --text:        #DDE8F0;
  --text-sub:    #8AAABE;
  --border:      rgba(74, 159, 213, 0.15);
  --error:       #E05C5C;
  --font-serif:  'Playfair Display', Georgia, serif;
  --font-sans:   'DM Sans', system-ui, sans-serif;
  --radius:      10px;
  --shadow:      0 4px 24px rgba(0, 0, 0, 0.4);
}

/* ── Reset & base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ───────────────────────────────────────────────────────────────
   HERO
─────────────────────────────────────────────────────────────── */
.hero {
  background:
    linear-gradient(160deg, rgba(74,159,213,0.07) 0%, transparent 60%),
    var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 3rem 1.5rem 2.5rem;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--accent);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  line-height: 1.1;
  color: var(--text);
  font-weight: 600;
}

.hero-title em {
  font-style: italic;
  color: var(--accent);
}

.hero-contador {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-sub);
}

/* ───────────────────────────────────────────────────────────────
   CONTROLES
─────────────────────────────────────────────────────────────── */
.controles {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.controles-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
}

/* Campo de búsqueda */
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-sub);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 2.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}

.search-input::placeholder { color: var(--text-sub); }
.search-input::-webkit-search-cancel-button { display: none; }

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s;
}
.search-clear:hover { color: var(--text); }

/* Selector de región */
.region-select {
  padding: 0.6rem 1rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  min-width: 180px;
  transition: border-color 0.18s, box-shadow 0.18s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238AAABE' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.25rem;
}
.region-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* ───────────────────────────────────────────────────────────────
   ESTADOS (carga / error / vacío)
─────────────────────────────────────────────────────────────── */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  min-height: 50vh;
}

.estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-sub);
}

.estado svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.estado p { font-size: 1rem; }
.estado small { font-size: 0.8rem; opacity: 0.7; }
.estado strong { color: var(--text); }

/* Spinner de carga */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.estado-carga p { color: var(--text-sub); }
.estado-error { color: var(--error); }
.estado-error svg { color: var(--error); opacity: 0.7; }

.btn-reintentar {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: var(--accent-dim);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--accent);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.18s;
}
.btn-reintentar:hover { background: rgba(74,159,213,0.25); }

/* ───────────────────────────────────────────────────────────────
   GRID DE TARJETAS
─────────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

/* ───────────────────────────────────────────────────────────────
   TARJETA (estilos reutilizados por CountryCard.vue)
─────────────────────────────────────────────────────────────── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
  border-color: rgba(74,159,213,0.35);
}

.card-flag {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface);
}

.card-flag img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 1rem 1.1rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-nombre {
  font-family: var(--font-sans);
  font-size: 0.975rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}

.card-datos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 0.75rem;
}

.dato { display: flex; flex-direction: column; gap: 0.15rem; }
.dato--full { grid-column: 1 / -1; }

.dato dt {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--text-sub);
  letter-spacing: 0.03em;
}

.dato dd {
  font-size: 0.82rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ───────────────────────────────────────────────────────────────
   PIE DE PÁGINA
─────────────────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-sub);
}

.footer a {
  color: var(--accent);
  text-decoration: none;
}
.footer a:hover { text-decoration: underline; }

/* ── Responsive ── */
@media (max-width: 500px) {
  .hero { padding: 2rem 1rem 1.75rem; }
  .controles { padding: 1rem; }
  .main { padding: 1.25rem 1rem 2.5rem; }
  .controles-inner { flex-direction: column; }
  .region-select { min-width: unset; width: 100%; }
}
</style>
