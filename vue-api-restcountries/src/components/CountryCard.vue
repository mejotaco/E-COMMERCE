<template>
  <article class="card">
    <!-- Bandera del país -->
    <div class="card-flag">
      <img
        :src="pais.flags.svg || pais.flags.png"
        :alt="`Bandera de ${pais.name.common}`"
        loading="lazy"
      />
    </div>

    <!-- Información del país -->
    <div class="card-body">
      <h2 class="card-nombre">{{ pais.name.common }}</h2>

      <dl class="card-datos">
        <div class="dato">
          <dt>Capital</dt>
          <dd>{{ pais.capital?.[0] ?? '—' }}</dd>
        </div>
        <div class="dato">
          <dt>Región</dt>
          <dd>{{ pais.region }}</dd>
        </div>
        <div class="dato">
          <dt>Subregión</dt>
          <dd>{{ pais.subregion ?? '—' }}</dd>
        </div>
        <div class="dato dato--full">
          <dt>Población</dt>
          <dd>{{ formatPoblacion(pais.population) }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>

<script setup>
// Props que recibe el componente
const props = defineProps({
  pais: {
    type: Object,
    required: true
  }
})

// Formatea la población con separadores de miles
function formatPoblacion(numero) {
  return numero.toLocaleString('es-MX')
}
</script>
