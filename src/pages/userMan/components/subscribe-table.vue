<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
        <el-form-item label="关键字">
          <el-input v-model="form.keyword" placeholder="真实姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        v-if="list.list.length>0 && list.list[0].now_price == 0"
        style="margin-bottom:10px"
        title="集合竞价中，'现价'、'浮动盈亏'、'总盈亏'暂不能查看"
        type="warning"
        close-text="知道了">
      </el-alert>
      <div class="table">
        <div class="table-top-btn">
          <el-row class="text-right">
            <el-button type="text" size="small" @click="addAccount">
              <i class="iconfont icon-add"></i>添加新股申购
            </el-button>
          </el-row>
        </div>
        <el-table
          v-loading="loading"
          :data="list.list"
          show-summary
          :summary-method="getSummaries"
          :row-class-name="tableRowClassName"
          :default-expand-all='true'
          style="width: 100%">
          
          <el-table-column
            prop="realName"
            label="真实姓名">
            <template slot-scope="scope">
              <p>
                {{scope.row.realName}}/<span class="small">{{scope.row.userId}}</span>
                <span class="small" v-if="scope.row.accountType == 1">(模拟)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="userAmt"
            label="提交资金">
            <template slot-scope="scope">
              <p class="number proColor bounceIn">
                {{(Number(scope.row.submitAmount)).toFixed(2)}}
              </p>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="isActive"
            label="状态">
            <template slot-scope="scope">
              <div>
                <a v-if="scope.row.status == 1" class="blue" title="预约成功"><i
                  class="iconfont icon-iconfontweitongguo"></i>预约成功</a>
                <a v-if="scope.row.status == 2" class="yellow" title="提交成功"><i class="iconfont icon-audi1Reject"></i>提交成功</a>
                <a v-if="scope.row.status == 3" class="green" title="已中签"><i
                  class="iconfont icon-tongguo4"></i>已中签</a>
                <a v-if="scope.row.status == 4" class="red" title="未中签"><i class="iconfont icon-dengdai"></i>未中签</a>
              </div>
              <!-- {{scope.row.isLock == 0?'未锁定':'锁定'}} -->
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="预约时间">
            <template slot-scope="scope">{{scope.row.addTime | timeFormat}}</template>
          </el-table-column>
          <el-table-column
            prop="submitTime"
            label="提交时间">
            <template slot-scope="scope">{{scope.row.submitTime | timeFormat}}</template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结果时间">
            <template slot-scope="scope">{{scope.row.endTime | timeFormat}}</template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注">
            <template slot-scope="scope">{{scope.row.remarks}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="250px"
            prop="isLock"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" :disabled="scope.row.status != 2"
                         size="small" @click="toChange(scope.row)">已中签
              </el-button>
              <el-button type="danger" size="small" :disabled="scope.row.status != 2" @click="toNoPass(scope.row)">未中签</el-button>
              <el-button type="danger" size="small" :disabled="scope.row.status != 2" @click="updateAccount(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            class="pull-right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.pageNum"
            :page-sizes="[10, 20, 30, 40,50]"
            :page-size="list.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="list.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <addDialog :getDate='getList' ref="addDialog"></addDialog>
    <updateDialog :info='detail' :getDate='getList' ref="updateDialog"></updateDialog>
   
  </div>

</template>

<script>
import * as api from '@/axios/api'
import addDialog from './subscribe-add'
import updateDialog from './subscribe-update'

export default {
  components: {
    addDialog,
    updateDialog
  },
  props: {},
  data () {
    return {
      form: {
        keyword: '',
        pageNum: 1,
        pageSize: 10
      },
      list: {
        list: []
      },
      detail: {},
      loading: false,
      timer: null,
      refresh: false,
      usertype: 0,
      changeTextClass: {} // 表格中的数据变化
    }
  },
  watch: {
    $route(){
      this.usertype = this.$route.query.type
    },
    usertype() {
      this.getList()
    },
  },
  computed: {},
  created () {
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleSizeChange (val) {
      this.form.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.form.pageNum = val
      this.getList()
    },
    onSubmit () {
      // 查询表格
      this.getList()
    },
    async getList () {
      // 获取表格数据
      let opts = {
        keyword: this.form.keyword,
        pageSize: this.form.pageSize,
        pageNum: this.form.pageNum
      }
      this.loading = true
      let data = await api.getStockSubscribeList(opts)
      if (data.status === 0) {
        this.list = data.data
      } else {
        this.$message.error(data.msg)
      }
      this.loading = false
    },
    addAccount () {
      // 添加
      this.$refs.addDialog.dialogVisible = true
    },
    updateAccount (row) {
      this.detail = row
      this.$refs.updateDialog.dialogVisible = true
    },
    toChange (row) {
      this.$confirm('确认中签成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.saveStockSubscribe({ id: row.id, status: 3 })
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    toNoPass (row) {
      this.$confirm('确认未中签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.saveStockSubscribe({ id: row.id, status: 4 })
        if (data.status === 0) {
          this.$message.success(data.msg)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      // 设置表格行高亮
      if (row.allProfitAndLose < 0 && ((-row.allProfitAndLose) / row.forceLine) >= 0.8) {
        return 'warning-row'
      }
      return ''
    },
    getSummaries (param) {
      // 底部计算
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一行 不统计
        if (index === 0) {
          sums[index] = '统计'
          return
        }
        if (column.property === 'submitAmount' ) {
          // 需要计算列 ==>    userAmt enableAmt  allFreezAmt allProfitAndLose forceLine
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = prev + curr
                return num
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index].toFixed(2)
          } else {
            sums[index] = 'N/A'
          }
        }
      })
      return sums
    },
    deleteUser (val) {
      // 删除用户所有信息
      this.$confirm('确认删除该用户吗？此操作不可恢复，将删除该用户所有的充值、提现与持仓记录！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await api.deleteDetail({ userId: val })
        if (data.status === 0) {
          await this.getList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .table .el-table .warning-row {
    background: rgba(245, 108, 108, .1);
  }

  .table .demo-table-expand {
    /deep/ label {
      display: block;
      text-align: center;
      line-height: 20px;
      width: 100%;
    }

    /deep/ .el-form-item {
      width: 16.6%;
      text-align: center;
    }
  }
</style>
