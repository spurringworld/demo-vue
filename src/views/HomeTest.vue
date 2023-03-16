<template>
  <div class="home">
    <h1>Flomesh</h1>
    <el-row :gutter="24" style="padding-top: 5px;">
      <el-col :span="1"><br></el-col>
      <el-col :span="22">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick"  v-loading="loading">
          <el-tab-pane label="首页" name="poc">
            <el-empty description="POC演示"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="学校列表" name="school">
            <el-table
              :data="schoolData"
              style="width: 100%">
              <el-table-column
                prop="id"
                label="ID"
                width="60">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="200">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="listStudents(scope.row.id)" type="text" size="small">查看学生</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="社团列表" name="club">
            <el-table
              :data="clubData"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="日期"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        
      </el-col>
      <el-col :span="1"><br></el-col>
    </el-row>
  </div>

</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        loading: false,
        activeName: 'poc',
        studentData: [],
        schoolData: [],
        clubData: [],
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
      };
    },
    created(){
      console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
    },
    methods: {
      handleClick(tab) {
        if("club" === tab.name) {
          this.clubData = this.tableData
          this.loading = false
        } else if("school" === tab.name){
          this.loading = true
          axios.get('/api-e/schools', this.loginForm).then(response =>{
            this.schoolData = response.data
            console.log(response.status)
          }).catch((err)=>{
            this.alarmUser(err)
          }).finally(()=>{
            this.loading = false
          })
        }
      },
      listStudents(row) {
        console.log(row)
      }
    }
  };
</script>
<style scoped>
a {
  color: #42b983;
}
</style>