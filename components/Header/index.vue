<template>
  <header id="header">
      <div class="wrap_header">
          <a class="wrap-brand-name" href="/" title="logo phimz69">
              <nuxt-img format="webp" id="brand-name" src="/icon.png" width="130" height="50" alt="logo-phimz"/>
          </a>
          <!-- <div class="main-menu">
              <nav class="menu">
                  <ul>
                      <li v-for="(menu, idx) in mainMenu" :key="idx">
                          <a :href="`/${menu.value}`" :title="menu.lable">{{ menu.lable }}</a>
                      </li>
                  </ul>
              </nav>
          </div>
          <span class="header-icon-new" id="header-icon" @click="handleMenu();">
              <span class="header-icon-new-top"><span class="line line-top "></span>
              </span>
              <span class="header-icon-new-bottom">
                  <span class="line line-bottom "></span>
              </span>
          </span> -->
      </div>
  </header>
</template>
<script>
export default {
  name: "HeaderComponent",
  data() {
      return {
          // mainMenu: [
          //     {
          //         lable: 'Danh Sách',
          //         value: ''
          //     },
          //     {
          //         lable: 'SEX VIET',
          //         value: 'category/sexviet'
          //     },
          //     {
          //         lable: 'VIET SUB',
          //         value: 'category/vietsub'
          //     },
          //     {
          //         lable: 'JAV HD',
          //         value: 'category/javhd'
          //     },
          //     {
          //         lable: 'ÂU MỸ',
          //         value: 'category/aumy'
          //     },
          //     {
          //         lable: 'UNCENSORED',
          //         value: 'category/uncensored'
          //     },
          // ],
      }
  },
  methods: {
  }
}
</script>

