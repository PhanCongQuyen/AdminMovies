<template>
  <div class="skeleton-wrapper">
    <div v-for="row in rows" :key="row" :class="`skeleton-animated ${noneRadius && 'none-radius'}`" :style="getCustomStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  components: {},
  props: {
    rows: { type: Number, default: 1 },
    height: { type: Number, default: 0 },
    noneRadius: { type: Boolean, default: false }
  },
  data() {
    return {};
  },
  computed: {
    getCustomStyle() {
      let result = '';
      if (this.height) {
        result = `height: ${this.height}px`;
      } else {
        result = `height: calc( ${100 / this.rows}% - ${this.rows > 1 ? '10' : '0'}px)`;
      }
      if (this.rows > 1) result += '; margin-bottom: 10px';
      return result;
    }
  }
};
</script>
<style src="./index.scss" lang="scss" scoped />
