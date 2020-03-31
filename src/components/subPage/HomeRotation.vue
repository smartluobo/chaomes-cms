<template>
  <div class="channels_box">
    <el-row style="width: 100%;padding: 10px 10px 10px 20px;background-color: #ececec">
      <el-button type="primary"  @click="toAdd()" icon="el-icon-edit-outline">新增轮播</el-button>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;padding: 20px">
      <el-table-column
        prop="gotoUrl"
        label="跳转地址">
      </el-table-column>
      <el-table-column
        label="图片">
        <template slot-scope="scope">
          <div >
            <img width="180px" height="120px" :src="scope.row.imageUrl">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="type=='add'?'新增轮播图':'修改轮播图'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
          <el-form-item label="轮播图" :label-width="formLabelWidth">
              <el-upload
                      class="upload-demo"
                      action="http://47.106.172.126:9001/tea/cms/image/upload"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
          </el-form-item>

        <el-form-item label="跳转地址" :label-width="formLabelWidth">
            <el-input v-model="form.gotoUrl" autocomplete="off" ></el-input>
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
    name: 'HomeRotation',
    data() {
      return {
        tableData: [],
        totalnum: 0,
        currentpage: 1,
        pagesize: 10,
        options:[],
        dialogFormVisible: false,
        form: {
          gotoUrl: '',
          imageUrl: '',
        },
        formLabelWidth: '120px',
        type:'add',
        fileList: [],
      }
    },
    mounted(){
        this.getTableListFS()
    },
    methods: {
      toAdd(){
        this.type = "add"
        this.dialogFormVisible = true
        this.form = {
          gotoUrl: '',
          imageUrl: '',
        }
        this.fileList = []
      },
      toSave(){
        if(this.type=="add"){
          let parm = {
            gotoUrl: this.form.gotoUrl,
            imageUrl: this.form.imageUrl,
          }
          let url = apis.addHomeRotation
          axios.post(url,parm).then(res =>{
            if(res.data.code==200){
              this.$message({
                type:'success',
                message: "添加成功"
              })
              this.dialogFormVisible = false
              this.getTableListFS()
            }else{
              this.$message({
                  type: 'info',
                  message: res.data.msg
              });
            }
          }).catch(err =>{
            console.log(err)
          })
        }else{
          let parm = {
            id: this.form.id,
            gotoUrl:this.form.gotoUrl,
            imageUrl:this.form.imageUrl
          }
          let url = apis.updateHomeRotation
          axios.post(url,parm).then(res =>{
            if(res.data.code==200){
              this.$message({
                type:'success',
                message: "修改成功"
              })
              this.dialogFormVisible = false
              this.getTableListFS()
            }else{
              this.$message({
                  type: 'info',
                  message: res.data.msg
              });
            }
          }).catch(err =>{
            console.log(err)
          })
        }

      },

      getTableListFS(){
          console.log(apis.getHomeRotationFS)
          let url = apis.getHomeRotationFS
          let param = { "pageSize":this.pagesize,"pageNum":this.currentpage}
          axios.post(url,param).then(res =>{
              this.tableData = res.data.list
              this.totalnum = res.data.total
          }).catch(err =>{
            console.log(err)
          })
      },

      getStoreName(val){
        let str = ''
        for(let i=0;i<this.options.length;i++){
          if(val==this.options[i].id){
            str = this.options[i].storeName
          }
        }
        return str
      },
      handleDelete(index, row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.toDeleteRow(row)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
      },
      toDeleteRow(val){
        let url = apis.deleteHomeRotation+"?id="+val.id
        axios.get(url).then(res =>{
          if(res.data.code==200){
            this.$message({
              type:'success',
              message: "删除成功"
            })
            this.dialogFormVisible = false
            this.getTableListFS()
          }else{
            this.$message({
                type: 'info',
                message: res.data.msg
            });
          }

        }).catch(err =>{
          console.log(err)
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(file) {
        this.form.imageUrl = file
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
        handleEdit(index, row) {
            this.type = "update"
            this.dialogFormVisible = true
            this.form.gotoUrl=row.gotoUrl
            this.form.imageUrl=row.imageUrl
            this.fileList=[{name:row.imageUrl,url:row.imageUrl}]
            this.form.id=row.id
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
