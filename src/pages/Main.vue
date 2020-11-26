<template>
  <div class="wrapper">
    <el-container style="border: 1px solid #eee">
      <!-- 头部 -->
      <el-header class="header-home">
        <img width="50px" :src="$store.state.siteInfo.siteLogo" alt="logo">
        {{$store.state.siteInfo.siteName}}后台管理系统
        <el-dropdown class="pull-right">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <span>{{$store.state.userInfo.adminName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 菜单 -->
          <MenuNav :navselected='1'/>
        </el-aside>
        <el-main class="wrapper-content" :style="contentStyleObj">
          <!-- 主页面 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MenuNav from '@/components/menu-nav'
import * as api from '@/axios/api'

export default {
  components: {
    MenuNav
  },
  props: {},
  data () {
    return {
      activeCategory: 'home',
      contentStyleObj: {
        height: ''
      }
    }
  },
  activated () {
    this.handleNav()
    this.$router.push('/capitalDetail')
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getSiteInfo()
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    handleClick (vo) {
      this.$router.push(`/home`)
    },
    // 处理加载后nav选中
    handleNav () {
      let arr = this.$route.path.split('/')
      let path = arr[arr.length - 1]
      this.activeCategory = path
    },
    async changePwd () {
      this.$store.state.loginIsShow = true
    },
    async logout () {
      // 退出登录
      let data = await api.logout()
      if (data.status === 0) {
        this.$router.push('/login')
      } else {
        this.$message.error(data.msg)
      }
    },
    async changePwd () {
      this.$store.state.loginIsShow = true
    },
    async logout () {
      // 退出登录
      let data = await api.logout()
      if (data.status === 0) {
        this.$router.push('/login')
      } else {
        this.$message.error(data.msg)
      }
    },
    getHeight () {
      this.contentStyleObj.height = window.innerHeight - 64 + 'px'
    },
    async getSiteInfo () {
      // 获取站点信息
      let data = await api.getInfo()
      if (data.status === 0) {
        this.$store.state.siteInfo = data.data
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .el-header {
    // background-color: #B3C0D1;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .header-home {
    padding: 0 30px 0 20px;
  }

  .el-card {
    overflow: visible;
  }
</style>
