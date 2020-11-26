<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="small">

        <el-form-item>
          <el-label>行情搜索</el-label>
        </el-form-item>

        <el-form-item>
          <el-input  placeholder="ID"/>
        </el-form-item>

        <el-form-item>
          <el-input  placeholder="股票名称"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select clearable filterable v-model="form.typeName" placeholder="类型">
            <el-option label="1min" value="1min"></el-option>
            <el-option label="5min" value="5min"></el-option>
            <el-option label="15min" value="15min"></el-option>
            <el-option label="30min" value="30min"></el-option>
            <el-option label="60min" value="60min"></el-option>
            <el-option label="1day" value="1day"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table">
        <div class="table-top-btn">
          <el-row class="text-right">
            <el-button type="primary" size="small" @click="addPrice" plain>发布行情</el-button>
          </el-row>
        </div>
        <el-table
          v-loading="loading"
          :data="list.list"
          style="width: 100%">
          <el-table-column
            prop="priceName"
            label="K线展现id"
            width="120">
            <template slot-scope="scope">
              <p>
                <span style="font-size:12px;color:#959595;">{{scope.row.id}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="publishTime"
            label="K线展现时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="stockName"
            label="股票名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="120">
          </el-table-column>
           <el-table-column
            width="180"
            prop="publishTime"
            label="发布时间">
            <template slot-scope="scope">{{scope.row.publishTime | timeFormat}}</template>
          </el-table-column>
          <el-table-column
            width="180"
            prop="openPrice"
            label="开盘价格">
          </el-table-column>
          <el-table-column
            width="180"
            prop="openPrice"
            label="收盘价格">
          </el-table-column>
          <el-table-column
            width="180"
            prop="highPrice"
            label="最高价格">
          </el-table-column>
          <el-table-column
            width="180"
            prop="lowPrice"
            label="最低价格">
          </el-table-column>
          <el-table-column
            width="180"
            prop="publishPrice"
            label="发布价格">
          </el-table-column>
          <el-table-column
            fixed="right"
            width="100"
            label="修改行情">
            <template slot-scope="scope">
              <el-button type="primary" title="修改行情" size="small" @click="editPrice(scope.row)">修改行情</el-button>
            </template>
          </el-table-column> 

          <!-- <el-table-column
            prop="typeName"
            label="类型名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            width="120">
          </el-table-column>
          <el-table-column
            prop="startInterval"
            width="120"
            label="开始区间">
          </el-table-column>
          <el-table-column
            width="120"
            prop="endInterval"
            label="值">
            <template>
              <p class="bounceIn">
                &le; X &lt; 
              </p>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="endInterval"
            label="结束区间">
          </el-table-column>
          <el-table-column
            width="150"
            prop="spreadRate"
            label="点差费率">
            <template slot-scope="scope">
            <p class="bounceIn">
              <span :class="scope.row.spreadRate>0?'green':'red'">{{scope.row.spreadRate}}</span>
            </p>
          </template>
          </el-table-column>
          <el-table-column
            width="180"
            prop="addTime"
            label="添加时间">
            <template slot-scope="scope">{{scope.row.addTime | timeFormat}}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="100"
            label="修改行情">
            <template slot-scope="scope">
              <el-button type="primary" title="修改行情" size="small" @click="editPrice(scope.row)">修改行情</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="page-box">
          <el-pagination
            class="pull-right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.pageNum"
            :page-sizes="[10, 20, 50, 100, 150, 200,500]"
            :page-size="list.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="list.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <addPriceDialog :priceList='list.list' :getDate='getList' ref="addPriceDialog"></addPriceDialog>
    <editPriceDialog :priceList='list.list' :info='detail' :getDate='getList' ref="editPriceDialog"></editPriceDialog>
  </div>

</template>

<script>
import * as api from '@/axios/api'
import addPriceDialog from './add-price'
import editPriceDialog from './edit-price'

export default {
  components: {
    addPriceDialog,
    editPriceDialog
  },
  props: {},
  data () {
    return {
      form: {
        typeName: '',
        pageNum: 1,
        pageSize: 100
      },
      list: {
        list: []
      },
      loading: false, // 表格加载
      detail: {}, // 用户信息
      agentList: []
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.getList()
    // this.getSiteSpreadList()
  },
  methods: {
    onSubmit () {
      // 查询表格
      this.getList()
    },
    handleSizeChange (val) {
      this.form.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.form.pageNum = val
      this.getList()
    },
    async getSiteSpreadList () {
      // 获取下级代理数据
      let opts = {
        pageNum: 1,
        pageSize: 100,
        typeName: ''
      }
      let data = await api.getSiteSpreadList(opts)
      if (data.status === 0) {
        this.agentList = data.data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    async getList () {
      let opts = {
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        type: this.form.type
      }
      let data = await api.getSitePriceList(opts)
      if (data.status === 0) {
        this.list = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    addPrice () {
      // 添加
      this.$refs.addPriceDialog.dialogVisible = true
    },
    editPrice (row) {
      // 修改
      this.detail = row
      this.$refs.editPriceDialog.dialogVisible = true
    }
  }
}
</script>
