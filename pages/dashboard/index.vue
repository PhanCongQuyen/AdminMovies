<template>
  <div class="container">
    <TableCustom :options="TABLE_OPTIONS" :fixed-header="true" :table-data="dataTable" :is-loading="isLoadingTable"
      :page-size="pageSize" :current-page="currentPage" :total-item="moviesData.total"
      @changePage="handleChangePage" @changeSearch="handleSearch">
      <template #bodyHeader="data">
        <!-- <div class="align-center"> -->
        <a :href="`https://phimz69.com/movie/${data.slugName}`" target="_blank">
          {{ `https://phimz69.com/movie/${data.slugName}` }}
        </a>
        <el-button @click="handleDrawerMovie(data)">Chi tiết</el-button>
        <!-- </div> -->
      </template>
      <template #thumnail="data">
        <img class="thumnail" :src="data.thumnail" alt="Ảnh phim" loading="lazy" />
      </template>
      <template #categories="data">
        <div v-for="(cat, idx) in data.categories" :key="idx">
          {{ getCategory(cat) }}
        </div>
      </template>
      <template #tags="data">
        {{ getTagOrSeo(data.tags) }}
      </template>
      <template #seo="data">
        {{ getTagOrSeo(data.seo) }}
      </template>
      <template #updated="data">
        {{ fomatDate(data.updated) }}
      </template>
      <template #active="data">
        {{ data.active ? 'Hiển thị' : 'Ẩn' }}
      </template>
    </TableCustom>
    <el-drawer title="Cập nhật movie" :visible.sync="drawer">
      <div style="padding:15px 20px">
        <div class="row-item">
          <label class="txt-title">Tên Phim:</label>
          <el-input ref="name" v-model="dataDetail.name" type="text" placeholder="Nhập tên phim"
            @keyup.enter="handleEnter('src')" />
        </div>
        <div class="row-item">
          <label class="txt-title">Link Phim:</label>
          <el-input ref="src" v-model="sourcesMovie" placeholder="Nhập link phim"
            @keyup.enter="handleEnter('description')" />
        </div>
        <div class="row-item">
          <label class="txt-title">Mô tả:</label>
          <el-input ref="description" v-model="dataDetail.description" placeholder="Nhập mô tả" type="textarea" :rows="4"
            @keyup.enter="handleEnter('thumbImg')" />
        </div>
        <div class="row-item">
          <label class="txt-title">Thumbnail:</label>
          <el-input ref="decrepthumbImgtions" v-model="dataDetail.thumnail" placeholder="Nhập link ảnh thumnail"
            @keyup.enter="handleEnter('thumbImg')" />
        </div>
        <div class="row-item">
          <label class="txt-title">Lượt xem:</label>
          <el-input v-model="dataDetail.viewed" placeholder="Nhập số lượng lượt xem" />
        </div>
        <div class="row-item">
          <label class="txt-title">Tag:</label>
          <el-input v-model="tags" placeholder="Nhập tag, bắt đầu tag bằng dấu #" />
        </div>
        <div class="row-item">
          <label class="txt-title">seo:</label>
          <el-input v-model="seo" placeholder="Nhập keyword seo, phân tách nhau bằng dấu ," />
        </div>
        <div class="row-item">
          <label class="txt-title">Danh mục:</label>
          <el-checkbox-group v-model="dataDetail.categories">
            <el-checkbox label="sexviet"></el-checkbox>
            <el-checkbox label="vietsub"></el-checkbox>
            <el-checkbox label="javhd"></el-checkbox>
            <el-checkbox label="aumy"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="row-item">
          <label class="txt-title">Hiển thị:</label>
          <el-switch v-model="dataDetail.active"></el-switch>
        </div>
        <div class="row-item-center">
          <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="handleUpdate()">Cập nhật</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import moment from 'moment';
import { TABLE_OPTIONS } from './constants'
import TableCustom from '~/components/TableCustom/index.vue';
export default {
  components: { TableCustom },
  layout: 'admin',
  data() {
    return {
      TABLE_OPTIONS,
      isLoadingTable: false,
      pageSize: 10,
      currentPage: 1,
      moviesData: {
        items: [],
        total: 0,
        totalPage: 0
      },
      drawer: false,
      dataDetail: {},
      sourcesMovie: '',
      tags: '',
      seo: '',
      keywork:'',
      fullscreenLoading: false
    }
  },
  computed: {
    dataTable() {
      return this.moviesData.items || [];
    },

  },
  async created() {
    const result = await this.$axios.get(`list?page=1`);
    if (result?.data) {
      this.moviesData = result.data;
    }
  },
  methods: {
    async handleSearch(val) {
      this.currentPage = 1;
      this.keywork = val;
      this.isLoadingTable = true;
      const keySearch = val?`&keywork=${val}`:'';
      const result = await this.$axios.get(`list?page=1${keySearch}`);
      if (result?.data) {
        this.moviesData = result.data;
      }
      this.isLoadingTable = false;
    },
    async handleChangePage(val) {
      this.currentPage = val;
      this.isLoadingTable = true;
      const keySearch = this.keywork?`&keywork=${this.keywork}`:'';
      const result = await this.$axios.get(`list?page=${val}${keySearch}`);
      if (result?.data) {
        this.moviesData = result.data;
      }
      this.isLoadingTable = false;
    },
    getTagOrSeo(val) {
      return val.toString();
    },
    getCategory(val) {
      switch (val) {
        case 'sexviet': return 'Sex Việt';
        case 'vietsub': return 'Vietsub';
        case 'javhd': return 'JAV HD';
        case 'aumy': return 'Âu Mỹ';
        case 'uncensored': return 'Chưa định dạng';
        default: return '';
      }
    },
    fomatDate(time) {
      if (time) {
        return moment(time).format('DD/MM/YYYY'); // convert data type date
      }
      return 'No Data';
    },
    handleDrawerMovie(data) {
      this.dataDetail = data;
      this.tags = data?.tags.toString() || '';
      this.seo = data?.seo.toString() || '';
      this.sourcesMovie = data?.sources?.[0]?.src || '';
      this.drawer = true;
    },
    async handleUpdate() {
      this.fullscreenLoading = true;
      if (this.sourcesMovie && this.sourcesMovie !== this.dataDetail?.sources?.[0]?.src) {
        this.dataDetail.sources[0].src = this.sourcesMovie;
      }
      if (this.tags && this.tags !== this.dataDetail.tags.toString()) {
        this.dataDetail.tags = this.tags.split(',');
      }
      if (this.seo && this.seo !== this.dataDetail.seo.toString()) {
        this.dataDetail.seo = this.seo.split(',');
      }
      const result = await this.$axios.post('update', this.dataDetail);
      if (result.status === 200) {
        this.$notify({
          title: 'Success',
          message: 'Update success',
          type: 'success'
        });
      } else {
        this.$notify.error({
          title: 'Error',
          message: 'Update fail'
        });
      }
      this.fullscreenLoading = false;
      this.drawer = false;
    }
  },
}
</script>
<style src="./index.scss" lang="scss" scoped />
