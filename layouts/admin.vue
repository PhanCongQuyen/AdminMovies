<template>
    <div>
       <HeaderPage/>
      <Nuxt />
    </div>
  </template>
<script>
import HeaderPage from '~/components/Header/index.vue'
export default {
    components: { HeaderPage }
}
</script>