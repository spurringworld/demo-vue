<template>
  <div class="home">
    <el-row :gutter="20" style="padding-top: 120px;">
      <el-col :span="6"><br></el-col>
      <el-col :span="12">
        <el-card class="box-card" style="min-width: 500px" v-loading="loading">
          <div slot="header" class="clearfix">
            <h3>欢迎使用工资条发送小程序</h3>
          </div>
          <br>
          <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" label-width="96px" style="padding-right:50px">
            <el-form-item label="用户：" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button size="small" type="primary" @click="doLoginAction('loginForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6"><br></el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
      },
    }
  },
  created(){
    var token = window.sessionStorage.getItem("user_token")
    console.log("token == " + token)
    if(token != '' && token != null){
      this.$router.push('/emailsallary')
    } 
    
  },
  methods: {
    resetLoginForm() {
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    doLoginAction(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          axios.post('/v1/user/login', this.loginForm).then(response =>{
            console.log(response)
            if(response.data.success == '1'){
              window.sessionStorage.setItem("user_token", response.data.result)
              this.$router.push('/emailsallary')
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
      })
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