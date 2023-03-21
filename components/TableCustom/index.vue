<template>
  <div class="root-table">
    <div class="root-header">
      <div class="box-search">
        <label>Tìm kiếm tên phim:</label>
        <el-input ref="name" v-model="keywork" type="text" placeholder="Nhập tên phim"
        @keyup.native.enter="handleEnterSearch()" />
      </div>
      <div class="table-header">
        <div v-for="(col, idx) in options" :key="idx" :ref="col.id" class="header-cell" :style="getCustomStyle(col)">
          {{ col.name }}
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loading-table">
      <Skeleton :rows="6" />
    </div>
    <div v-else>
      <div v-if="tableData.length === 0" class="empty-block">
        <el-image class="empty-image" src="/empty-data.svg" fit="contain"></el-image>
      </div>
      <div v-for="(data, idxData) in tableData" :key="idxData" class="table-body">
        <div class="body-header">
          <slot name="bodyHeader" v-bind="data"></slot>
        </div>
        <div class="body-content">
          <div v-for="(col, idx) in options" :key="idx" class="body-cell" :style="getCustomStyle(col)">
            <div v-if="!!col.slot">
              <slot :name="col.id" v-bind="data"></slot>
            </div>
            <div v-else>
              <el-tooltip v-if="col.ellipsis && isEllipsis(data[col.id], col.id)" effect="dark" :content="data[col.id]"
                placeholder="top">
                <div>{{ getEllipsisStr(data[col.id], col.id) }}</div>
              </el-tooltip>
              <div v-else>{{ data[col.id] || '' }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Paging -->
      <div class="justify-center">
        <el-pagination :current-page="pageNumber" :page-size="pageSize"
          :pager-count="5" layout="prev, pager, next" :total="totalItem" @current-change="handleCurrentChange"/>
      </div>
      <!-- Paging -->
    </div>
  </div>
</template>

<script>
import Skeleton from '../Skeleton/index.vue';
import { ellipsisStr } from '~/utils';
// import debounce from 'lodash/debounce';
export default {
  name: 'TableCustom',
  components: { Skeleton },
  props: {
    options: { type: Array, default: () => [] },
    tableData: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    pageSize: { type: Number, default: 10 },
    currentPage: { type: Number, default: 1 },
    totalItem: { type: Number, default: 0 },
  },
  data() {
    return {
      showMore: [],
      initData: true,
      checkboxItems: [],
      pageNumber: this.currentPage,
      keywork: ''
    };
  },
  watch: {
    pageNumber(value) {
      this.$emit('changePage', value);
    }
  },
  // mounted() {
  //   this.handleDebouncedScroll = debounce(this.handleScroll, 100);
  //   document.getElementById('container').addEventListener('scroll', this.handleDebouncedScroll);
  // },
  // beforeDestroy() {
  //   document.getElementById('container').removeEventListener('scroll', this.handleDebouncedScroll);
  // },
  methods: {
    handleEnterSearch() {
      this.$emit('changeSearch', this.keywork);
    },
    // handle pagination (S)
    handleCurrentChange(val) {
      this.pageNumber = val;
    },
    // handle pagination (E)
    getCustomStyle(col) {
      const { flex, minWidth } = col;
      let result = '';
      if (flex) {
        result = `flex: ${flex};`;
      }
      if (minWidth) result += `min-width: ${minWidth}px`;
      return result;
    },
    isEllipsis(str, id) {
      if (!str) return false;
      const clientWidth = this.$refs[id]?.[0].clientWidth;
      const strOffset = parseInt((clientWidth - 40 - 3 * 7) / 7) + 1;
      return str.length > strOffset;
    },
    getEllipsisStr(data, id) {
      const clientWidth = this.$refs[id]?.[0].clientWidth;
      return ellipsisStr(data, { width: clientWidth, size: 7, margin: 40 });
    }
  }
};
</script>
<style src="./index.scss" lang="scss" scoped />
