<template>
  <div class="emailsallary">

    <!-- 小程序主体 -->
    <div>
    <el-row :gutter="20" style="padding-top: 120px;">
      <el-col :span="6"><br></el-col>
      <el-col :span="12">
        <el-card class="box-card" style="min-width: 500px" v-loading="loading">
          <div slot="header" class="clearfix">
            <h3>欢迎使用工资条发送小程序</h3>
          </div>
          <br>
          <el-form ref="sallaryEmailform" :model="sallaryEmailform" :rules="sallaryEmailRules" label-width="96px">
            <el-form-item  label="工资表：" prop="SallaryFileName" style="text-align: left">
              <el-tooltip class="item" effect="dark" content="点击下方按钮选择文件" placement="top-start">
                <el-input v-model="sallaryEmailform.SallaryFileName" :readonly="true" maxlength="50"></el-input>
              </el-tooltip>
              <el-upload
                name="sallaryFile"
                action="/api/v1//upload/sallarybill"
                accept=".xlsx"
                :on-success="uploadOK"
                :file-list="fileList"
                :on-remove="removeFile"
                :on-exceed="uploadMore"
                :on-error="alarmUser"
                :data="uploadData"
                :limit="1">
                <el-button size="small" type="info" plain>选择工资表文件（.xlsx）</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="邮件标题：" prop="title">
              <el-input v-model="sallaryEmailform.title" placeholder="xx月份工资详情" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="备注说明：" prop="notice">
              <el-input type="textarea" v-model="sallaryEmailform.notice" maxlength="200" show-word-limit rows="3"></el-input>
            </el-form-item>
            <el-form-item style="text-align: left">
              <el-button size="small" type="primary" @click="submitSallaryEmail('sallaryEmailform')">发送邮件</el-button>
              <el-button size="small" type="primary" @click="doLogoutAction">退出</el-button>
              <el-button style="float: right; padding: 15 15 15 15" type="text" @click="drawer = true">
                <i class="el-icon-reading el-icon--right" /> 使用说明
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6"><br></el-col>
    </el-row>
    </div>

    <!-- 《使用说明》 -->
    <el-drawer title="《使用说明》" :visible.sync="drawer" size="39%">
      <div style="text-align: left; padding-left: 50px;">
      <h4>第一步: 上传工资表文件（工资表项为必填项）</h4>
      <ul style="text-align: left; padding-left: 50px;">
        <li>工资表文件必须是格式为（<b>.xlsx</b>）的Excel文件</li>
        <li>工资数据表需要放在<b>Sheet1</b>里面</li>
        <li>数据表格第1行是标题，数据从第2行开始</li>
        <li>员工收邮件的Email地址放在每一条数据的<b>最后一列</b></li>
      </ul>
      <h4>第二步:输入邮件标题和备注说明（邮件标题项为必填项）</h4>
      <h4>第三步: 点击“发送邮件”按钮，开始发送工资条邮件</h4>
      <br><br>
      <b>参考：</b><a href="/download/sample.xlsx">《工资表文件》样例下载</a>
      </div>
      <br><br><br><br><br><br><br><br><br><br>
      <div style="text-align: right; padding-right: 40px; padding-bottom: 40px; margin:auto; position: absolute; right: 0; bottom: 0;">
        <small>版本号：0.1.0</small>
      </div>
    </el-drawer>

    <el-dialog title="工资条已发送" :visible.sync="dialogVisible">
      <el-collapse>
        <el-collapse-item v-bind:title="yesTitle" name="1">
          <div style="text-align: left">{{yesResult}}</div>
        </el-collapse-item>
        <el-collapse-item v-bind:title="noTitle" name="2">
          <div style="text-align: left">{{noResult}}</div>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      dialogVisible: false,
      isLogin: false,
      loading: false,
      drawer: false,
      yesResult: '',
      noResult: '',
      yesTitle: '已发送人员名单',
      noTitle: '未发送人员名单 - 邮箱缺失或格式不正确',
      fileList: [],
      sallaryEmailform: {
        title: '',
        notice: '',
        SallaryFileName: ''
      },
      sallaryEmailRules: {
          title: [
            { required: true, message: '请输入邮件标题', trigger: 'blur' }
          ],
          SallaryFileName: [
            { required: true, message: '请选择输入一个工资表文件', trigger: ['blur', 'change'] }
          ]
      },
      uploadData: {
        token: ''
      }
    }
  },
  created() {
    var token = window.sessionStorage.getItem("user_token")
    this.uploadData.token = token
    console.log("token == " + token)
    if(token == '' || token == null){
      this.$router.push('/')
    }
  },
  methods: {
    doLogoutAction(){
      window.sessionStorage.removeItem("user_token")
      this.$router.push('/')
    },
    submitSallaryEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          axios.post('/v1/email/sallarybill', this.sallaryEmailform).then(response =>{
            if(response.data.success == '1'){
              this.yesResult = response.data.yesResult
              this.noResult = response.data.noResult
              this.yesTitle = response.data.yesTitle
              this.noTitle = response.data.noTitle
              this.dialogVisible = true
            } 
            else if(response.data.success == '-1'){
              this.$message.error(response.data.message);
              this.doLogoutAction()
            }
            else {
              this.$message.error(response.data.message);
            }
          }).catch((err)=>{
            this.alarmUser(err)
          }).finally(()=>{
            this.loading = false
          })
        } else {
          this.$message.error('错了哦，请注意完成红色提示项');
          return false;
        }
      });
    },
    uploadOK(response, file, fileList){
      console.log(response)
      if(response.success == '1'){
        this.sallaryEmailform.SallaryFileName = file.name
        this.fileList = fileList
      } else if(response.success == '-1'){
        this.$message.error(response.message);
        this.doLogoutAction()
      } else {
        this.fileList = []
        this.$message.error(response.message);
      }
    },
    removeFile(){
      this.sallaryEmailform.SallaryFileName = ""
      this.fileList = []
    },
    uploadMore(){
      if(this.sallaryEmailform.SallaryFileName != ""){
        this.$message.warning('请先移除已选择的文件！');
        return false
      }
    },
    alarmUser(err){
      console.log(err)
      this.$message.error('系统服务出错了，请联系管理员！');
    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>