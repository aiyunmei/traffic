<template>
    <div class="header">
        <div class="header-info">
            <div class="logo">管理平台</div>
            <div class="user-info">
                <el-dropdown trigger="hover" @command="handleCommand">
                <span class="el-dropdown-link">
                    欢迎，{{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        name: ''
      }
    },
    computed: {
      username () {
        let username = localStorage.getItem('ms_username')
        if (username) {
          return username
        } else {
          return this.name
        }
      }
    },
    methods: {
      handleCommand (command) {
        if (command === 'loginout') { // 移除缓存
          localStorage.removeItem('ms_username')
          localStorage.removeItem('routerData')
          localStorage.removeItem('companyId')
          localStorage.removeItem('accountId')
          this.$router.push('/login')
        }
      }
    }
  }
</script>

<style scoped>
    .header {
        box-sizing: border-box;
        width: 100%;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header-info{
        width: 80%;
        height: 70px;
        margin: 0 auto;
        position: relative;
    }
    .header .logo{
        width:250px;
        text-align: center;
        position: absolute;
        left: 0;
    }
    .user-info {
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
        position: absolute;
        right: 0;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
