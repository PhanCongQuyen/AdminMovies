<template>
    <header id="header">
        <div class="wrap_header">
            <a class="wrap-brand-name" href="/dashboard" title="logo phimz69">
                <nuxt-img id="brand-name" format="webp" src="/icon.png" width="130" height="50" alt="logo-phimz" />
            </a>
            <button class="btn-right" @click="setRedisServer">
                Reload Redis Server
            </button>

            <input ref="input-file" class="input-file" type="file" @change="onFileChange" />
            <button class="btn-right" @click="uploadExcel">Upload excel</button>
        </div>
        <el-dialog :title="dialogInfor.title" :visible.sync="dialogVisible" width="30%" center :before-close="clearData">
            <span>{{ dialogInfor.content }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="handleCancel(dialogInfor.type)">Cancel</el-button>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="handleAcceptUpload(dialogInfor.type)">Confirm</el-button>
            </span>
        </el-dialog>
    </header>
</template>
<script>
import readXlsxFile from 'read-excel-file'
export default {
    name: 'HeaderComponent',
    data() {
        return {
            dialogVisible: false,
            dialogInfor: {},
            paramsUpload: [],
            fullscreenLoading: false
        }
    },
    methods: {
        validateData(data) {
            if (!data?.name || !data?.thumnail || !data?.sources) return false;
            return true;
        },
        async onFileChange(event) {
            this.paramsUpload = [];
            const xlsxfile = event.target.files ? event.target.files[0] : null;
            const rows = await readXlsxFile(xlsxfile);
            const idxData = {
                name: -1,
                description: -1,
                thumnail: -1,
                sources: -1,
                tags: -1,
                categories: -1,
                seo: -1
            }
            rows.forEach(cells => {
                const data = {
                    name: '',
                    description: '',
                    thumnail: '',
                    sources: [],
                    tags: [],
                    tagSlugs: [],
                    categories: '',
                    seo: [],
                    active: false,
                    ishow: true
                }
                if (idxData.name === -1) {
                    idxData.name = cells.findIndex(cell => cell?.toString().toLowerCase() === 'name');
                } else {
                    data.name = cells[idxData.name] || '';
                }
                if (idxData.description === -1) {
                    idxData.description = cells.findIndex(cell => cell?.toString().toLowerCase() === 'descriptions');
                } else {
                    data.description = cells[idxData.description];
                }
                if (idxData.thumnail === -1) {
                    idxData.thumnail = cells.findIndex(cell => cell?.toString().toLowerCase() === 'thumnail');
                } else {
                    data.thumnail = cells[idxData.thumnail];
                }
                if (idxData.sources === -1) {
                    idxData.sources = cells.findIndex(cell => cell?.toString().toLowerCase() === 'srcs');
                } else {
                    const dataSources = { src: cells[idxData.sources], type: 'iframe' }
                    data.sources.push(dataSources);
                    // data.sources = cells[idxData.sources];
                }
                if (idxData.tags === -1) {
                    idxData.tags = cells.findIndex(cell => cell?.toString().toLowerCase() === 'tags');
                } else {
                    const arrTags = cells[idxData.tags]?.toString()?.split(',') || [];
                    const dataTags = [];
                    const dataTagSlugs = [];
                    arrTags.forEach(str => {
                        const tag = this.converTagAndCat(str);
                        if (tag) {
                            dataTags.push(str.trim());
                            dataTagSlugs.push(tag)
                        }

                    })
                    data.tags = dataTags;
                    data.tagSlugs = dataTagSlugs;
                }
                if (idxData.categories === -1) {
                    idxData.categories = cells.findIndex(cell => cell?.toString().toLowerCase() === 'categories');
                } else {
                    const arrCate = cells[idxData.categories]?.toString()?.split(',') || [];
                    const dataCate = [];
                    arrCate.forEach(str => {
                        const cate = this.converTagAndCat(str);
                        if (cate) {
                            dataCate.push(cate);
                        }

                    })
                    data.categories = dataCate;
                }
                if (idxData.seo === -1) {
                    idxData.seo = cells.findIndex(cell => cell?.toString().toLowerCase() === 'seo');
                } else {
                    const arrSeo = cells[idxData.seo]?.toString()?.split(',') || [];
                    const dataSeo = [];
                    arrSeo.forEach(str => {
                        const seo = this.converTagAndCat(str);
                        if (seo) {
                            dataSeo.push(seo)
                        }

                    })
                    data.seo = dataSeo;
                }
                if (this.validateData(data)) {
                    this.paramsUpload.push(data);
                }
            });
            this.dialogInfor = {
                title: 'Upload excel',
                content: `Do you want to upload file "${xlsxfile.name}" to the server ?`,
                type: 'upload',
            }
            this.dialogVisible = true
        },
        uploadExcel() {
            this.$refs['input-file'].click();
        },
        async handleAcceptUpload(cType) {
            this.fullscreenLoading = true;
            if (cType === 'upload') {
                if (this.paramsUpload?.length>0) {
                    const result = await this.$axios.post('import', {data: this.paramsUpload});
                    if (result.status === 200) {
                        this.$notify({
                        title: 'Success',
                        message: 'Upload success',
                        type: 'success'
                        });
                    } else {
                        this.$notify.error({
                        title: 'Error',
                        message: 'Upload fail'
                        });
                    }
                }
            } else if(cType==='update') {
                const result = await this.$axios.get('/setRedisPcq');
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
            }
            this.dialogVisible = false;
            this.fullscreenLoading = false;
            
        },
        converTagAndCat(str) {
            if (!str) return;
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
            str = str.replace(/\u02C6|\u0306|\u031B/g, "");
            str = str.replace(/,+ /g, ",");
            str = str.trim();
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");

            return str?.toLowerCase() || null;
        },
        handleCancel() {
            this.$refs['input-file'].value = "";
            this.dialogVisible = false
        },
        handleAccept() {
            this.$refs['input-file'].value = "";
            this.dialogVisible = false
        },
        setRedisServer() {
            this.dialogInfor = {
                title: 'Update redis server',
                content: 'Are you sure to update the cache server ?',
                type: 'update',
            }
            this.dialogVisible = true
        },
        clearData(done){
            this.$refs['input-file'].value = "";
            done();
        }
    },
}
</script>
  