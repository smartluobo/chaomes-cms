<template>
    <div class="channels_box">
        <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
            <el-button type="primary" @click="toAddGoods()" icon="el-icon-edit-outline">新增商品</el-button>
            <span style="margin:20px;">商品名称:</span>
            <el-input
                    style="display:inline-block;width:200px;"
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="goodsName">
            </el-input>
            <el-button @click=toSearch() style="margin-left:20px;" icon="el-icon-search" circle></el-button>
        </el-row>
        <el-table
                :data="tableData"
                stripe
                style="width: 100%;padding: 20px">
            <el-table-column prop="goodsName" label="商品名称" width="180"></el-table-column>

            <el-table-column prop="channelsNum" label="商品海报">
                <template slot-scope="scope">
                    <div>
                        <img width="80px" height="60px" :src="scope.row.goodsPosters">
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="goodsPrice" label="商品价格(元)"></el-table-column>
            <el-table-column prop="goodsStatusView" label="商品状态"></el-table-column>
            <el-table-column prop="goodsInventory" label="库存"></el-table-column>
            <el-table-column prop="isTrialView" label="是否免费领取"></el-table-column>
            <el-table-column prop="commissionTypeView" label="提成方式"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentpage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalnum">
        </el-pagination>
        <el-dialog :title="type=='add'?'新增商品':'修改商品'" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="商品名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.goodsName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="首页卖点介绍：" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.sellPoint"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品价格：" :label-width="formLabelWidth">
                            <el-input v-model="form.goodsPrice" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品库存：" :label-width="formLabelWidth">
                            <el-input v-model="form.goodsInventory" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品限购数量：" :label-width="formLabelWidth" :visible.sync="commissionVisible">
                            <el-input v-model="form.buyLimit" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上架状态：" :label-width="formLabelWidth">
                            <el-select v-model="form.goodsStatus" placeholder="上架状态" width="300px">
                                <el-option label="上架" value="1"></el-option>
                                <el-option label="下架" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否免费领取：" :label-width="formLabelWidth">
                            <el-select v-model="form.isTrial" placeholder="是否赠品" :size="selectInputWidth">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="佣金分配方式：" :label-width="formLabelWidth">
                            <el-select v-model="form.commissionType" placeholder="代理商提成方式">
                                <el-option label="代理商比例提成" value="0"></el-option>
                                <el-option label="固定金额" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提成金额：" :label-width="formLabelWidth">
                            <el-input v-model="form.commissionAmount" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-form-item label="商品详情页介绍：" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.simpleDesc"></el-input>
                </el-form-item>
                <el-form-item label="商品首页海报图：" :label-width="formLabelWidth">
                    <el-upload action="http://47.106.172.126:9001/tea/cms/image/upload"
                               :on-change="handlerPosterSuccess" list-type="picture-card"
                               :auto-upload="true" :file-list="goodsPosterList">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
                </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" v-for="item in goodsCarouselImageList" key="item" :src="item" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="商品详情页轮播图：" :label-width="formLabelWidth">
                    <el-upload action="http://47.106.172.126:9001/tea/cms/image/upload"
                               :on-change="handlerCarouselSuccess" list-type="picture-card"
                               :auto-upload="true" :file-list="goodsCarouselImageList">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
                </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" v-for="item in goodsCarouselImageList" key="item" :src="item" alt="">
                    </el-dialog>
                </el-form-item>

                <el-form-item label="商品详情图片：" :label-width="formLabelWidth">
                    <el-upload action="http://47.106.172.126:9001/tea/cms/image/upload"
                               :on-change="handlerDetailSuccess" list-type="picture-card"
                               :auto-upload="true" :file-list="goodsDetailImagesList">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
                </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" v-for="item in goodsDetailImagesList" key="item" :src="item" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="toSave()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apis from '../../env/apis.js'
    import axios from '../../env/axios.js'

    export default {
        name: 'GoodList',
        data() {
            return {
                tableData: [],
                totalnum: 0,
                currentpage: 1,
                pagesize: 10,
                type: 'add',
                dialogFormVisible: false,
                commissionVisible: false,
                form: {
                    goodsName: '',
                    sellPoint: '',
                    goodsPrice: '',
                    goodsInventory: 0,
                    goodsStatus: '',
                    goodsPosters: '',
                    goodsCarouselImage: '',
                    goodsDetailImages: '',
                    isTrial: '',
                    simpleDesc: '',
                    commissionType: '',
                    commissionAmount: 0,
                    buyLimit: '',
                    receiveFlag: '',
                    id: ''
                },

                formLabelWidth: '160px',
                selectInputWidth: '295px',
                goodsPosterList: [],
                goodsDetailImagesList: [],
                goodsCarouselImageList: [],
                goodsName: '',
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false
            }
        },

        mounted() {
            this.getTableListFS()
        },

        methods: {
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                console.log(file);
            },
            toSearch() {
                this.getTableListFS()
            },

            toSave() {
                if (this.type == "add") {
                    let parm = {
                        goodsName: this.form.goodsName,
                        sellPoint: this.form.sellPoint,
                        goodsPrice: this.form.goodsPrice,
                        goodsInventory: this.form.goodsInventory,
                        goodsStatus: this.form.goodsStatus,
                        goodsPosters: this.getUrls(this.goodsPosterList),
                        goodsCarouselImages: this.getUrls(this.goodsCarouselImageList),
                        goodsDetailImages: this.getUrls(this.goodsDetailImagesList),
                        isTrial: this.form.isTrial,
                        simpleDesc: this.form.simpleDesc,
                        commissionType: this.form.commissionType,
                        commissionAmount: this.form.commissionAmount,
                        buyLimit: this.form.buyLimit,
                        receiveFlag: this.form.receiveFlag
                    }
                    let url = apis.addGoods
                    axios.post(url, parm).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "添加成功"
                            })
                            this.dialogFormVisible = false
                            this.getTableListFS()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.data.msg
                            });
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    let parm = {
                        goodsName: this.form.goodsName,
                        sellPoint: this.form.sellPoint,
                        goodsPrice: this.form.goodsPrice,
                        goodsInventory: this.form.goodsInventory,
                        goodsStatus: this.form.goodsStatus,
                        goodsPoster: this.form.goodsPoster,
                        isTrial: this.form.isTrial,
                        simpleDesc: this.form.simpleDesc,
                        commissionType: this.form.commissionType,
                        commissionAmount: this.form.commissionAmount,
                        buyLimit: this.form.buyLimit,
                        receiveFlag: this.form.receiveFlag,
                        goodsCarouselImages: this.getUrls(this.goodsCarouselImageList),
                        goodsDetailImages: this.getUrls(this.goodsDetailImagesList),
                        goodsPosters: this.getUrls(this.goodsPosterList),
                        id: this.form.id

                    }
                    let url = apis.updateGoods
                    axios.post(url, parm).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "修改成功"
                            })
                            this.dialogFormVisible = false
                            this.getTableListFS()
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.data.msg
                            });
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                }
            },


            toAddGoods() {
                this.type = "add",
                    this.dialogFormVisible = true,
                    this.commissionVisible = true,
                    this.goodsPosterList = [],
                    this.goodsDetailImagesList = [],
                    this.goodsCarouselImageList = [],
                    this.dialogVisible = false,
                    this.disabled = false
                this.form = {
                    goodsName: '',
                    sellPoint: '',
                    goodsPrice: '',
                    goodsInventory: 0,
                    goodsStatus: '',
                    goodsPoster: '',
                    goodsCarouselImage: '',
                    goodsDetailImages: '',
                    isTrial: '',
                    simpleDesc: '',
                    commissionType: '',
                    commissionAmount: 0,
                    buyLimit: 0,
                    receiveFlag: '',
                    id: ''
                }
            },
            getTableListFS() {
                let pram = {
                    "pageSize": this.pagesize, "pageNum": this.currentpage
                }
                let condition
                if (this.goodsName !== '') {
                    condition = {"goodsName": this.goodsName}
                }
                let url = apis.getGoodListFS
                pram.condition = condition
                axios.post(url, pram).then(res => {
                    this.tableData = this.getListData(res.data.list)
                    this.totalnum = res.data.total
                }).catch(err => {
                    console.log(err)
                })
            },
            getListData(val) {
                var list = []
                for (var i = 0; i < val.length; i++) {
                    val[i].goodsStatus = val[i].goodsStatus.toString()
                    val[i].isTrial = val[i].isTrial.toString()
                    val[i].commissionType = val[i].commissionType.toString()
                    val[i].goodsStatusView = val[i].goodsStatus === "1" ? "上架" : "下架"
                    val[i].isTrialView = val[i].isTrial === "1" ? "是" : "否"
                    val[i].commissionTypeView = val[i].commissionType === "1" ? "固定金额" : "代理商比例提成"
                    list.push(val[i])
                }
                return list
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagesize = val
                this.getTableListFS()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentpage = val
                this.getTableListFS()
            },

            handleSuccess1(file) {
                this.form.goodsPoster = file
            },

            handleSuccess2(file) {
                this.form.goodsDetailImages = file
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.toDeleteGoods(row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            toDeleteGoods(val) {
                let url = apis.deleteGoods + "?id=" + val.id
                axios.get(url).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: "删除成功"
                        })
                        this.dialogFormVisible = false
                        this.getTableListFS()
                    } else {
                        this.$message({
                            type: 'info',
                            message: res.data.msg
                        });
                    }

                }).catch(err => {
                    console.log(err)
                })
            },
            handleEdit(index, row) {

                this.type = "update"
                this.dialogFormVisible = true
                this.form.goodsName = row.goodsName
                this.form.sellPoint = row.sellPoint
                this.form.goodsPrice = row.goodsPrice
                this.form.goodsInventory = row.goodsInventory
                this.form.goodsStatus = row.goodsStatus
                this.form.goodsPoster = row.goodsPoster
                this.form.goodsCarouselImage = row.goodsCarouselImage
                this.form.goodsDetailImages = row.goodsDetailImages
                this.form.isTrial = row.isTrial
                this.form.simpleDesc = row.simpleDesc
                this.form.commissionType = row.commissionType
                this.form.commissionAmount = row.commissionAmount
                this.form.buyLimit = row.buyLimit
                this.form.receiveFlag = row.receiveFlag
                this.goodsCarouselImageList = this.setObjUrls(row.goodsCarouselImages)
                this.goodsDetailImagesList = this.setObjUrls(row.goodsDetailImages)
                this.goodsPosterList = this.setObjUrls(row.goodsPosters)
                this.form.id = row.id
            },

            getUrls(list) {
                let str = ""
                list.map(e => {
                    str = str + e.url + ","
                });
                return str.substring(0, str.length - 1)
            },
            setObjUrls(urlStr) {
                let urlList = urlStr.split(",");
                let urlObjList = [];
                urlList.map(e => {
                    console.log(e)
                    let uniName = e.substring(e.lastIndexOf("/") + 1)
                    console.log(uniName)
                    urlObjList.push({name: uniName, url: e})
                });
                return urlObjList;
            },
            handlerCarouselSuccess(file) {
                if (file.response != null || file.response != undefined) {
                    this.goodsCarouselImageList.push({name: file.name, url: file.response})
                }
            },
            handlerDetailSuccess(file) {
                if (file.response != null || file.response != undefined) {
                    this.goodsDetailImagesList.push({name: file.name, url: file.response})
                }
            },
            handlerPosterSuccess(file) {
                if (file.response != null || file.response != undefined) {
                    this.goodsPosterList.push({name: file.name, url: file.response})
                }
            }
        }
    }
</script>

<style scoped>
    .channels_box {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .pagination {
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 300px;
        right: 0;
        margin: auto;
        padding: 20px;
    }

</style>
