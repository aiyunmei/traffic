<template>
  <div class="login-wrap" v-loading.fullscreen.lock="this.$store.state.loading">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="loginName">
          <el-input v-model="ruleForm.loginName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  import getRouter from './js/getRouter'
  export default {
    data () {
      return {
        loading: false,
        ruleForm: {
          loginName: '',
          password: ''
        },
        rules: {
          loginName: [
            {required: true, message: '请输入用户名', toggle: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', toggle: 'blur'}
          ]
        }
      }
    },
    created () {
      this.Result()
    },
    methods: {
      Result () {
        let loginName = localStorage.getItem('ms_username')
        if (loginName) {
          this.$router.push('/readme')
        }
      },
      submitForm (formName) {
        const that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$store.commit('setLoading', true)
            let params = {
              loginName: that.ruleForm.loginName,
              password: that.ruleForm.password
            }
            that.$axios.post(that.api.login, qs.stringify(params)).then((res) => {
              if (res.data.msg.code === '20000') {
                let routerData = res.data.data.modules
                let companyId = res.data.data.companyId
                let accountId = res.data.data.Id
                localStorage.setItem('ms_username', that.ruleForm.loginName) // 存储 用户信息
                localStorage.setItem('routerData', JSON.stringify(routerData)) // 存储 路由
                localStorage.setItem('companyId', companyId)  // 存储 companyId
                localStorage.setItem('accountId', accountId) // 存储 账号id
                that.$router.addRoutes(getRouter(routerData, that.getParentPath)) // 渲染后台传送过来的路由
                that.$router.push('/readme')
                that.$store.commit('setRouterData', routerData)
              } else {
                that.$message({type: 'error', message: res.data.msg.message})
              }
              that.$store.commit('setLoading', false)
            }).catch((err) => {
              console.log(err)
              that.$store.commit('setLoading', false)
              that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
            })
          } else {
            console.log('error')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background: url('../../assets/login_bg.jpg') no-repeat;
    background-size: 100% 100%;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;

  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
    opacity: 0.9;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>
