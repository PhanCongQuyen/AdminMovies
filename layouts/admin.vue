<template>
    <div>
       <HeaderPage/>
      <Nuxt />
      <span>footer</span>
    </div>
  </template>
<script>
import HeaderPage from '~/components/Header/index.vue'
export default {
    components: { HeaderPage }
}
</script>