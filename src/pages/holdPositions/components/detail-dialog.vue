<template>
  <div class="wrapper">
    <el-dialog
      :title="info?info.positionType==1?'持仓详情（模拟）':'持仓详情':'' "
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="12">
                <span>
                    {{info?info.stockName:'-'}} {{info?info.stockCode:'-'}}
                </span>
                <span>
                    （{{info?info.sellOrderId?'平仓':'持仓中':'-'}}）
                </span>
              </el-col>
              <el-col v-if="info && info.allProfitAndLose" :span="12" class="text-right">
                总盈亏：
                <span v-if="info.now_price == 0 && !info.sellOrderPrice">
                    -
                </span>
                <span v-else :class="info.allProfitAndLose>0?'red number':'green number'">{{info?info.allProfitAndLose:'-'}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="text box-content">

            <el-row>
              <el-col v-if="info && info.now_price" :span="8">
                现价：
                <span v-if="info.now_price == 0">
                                -
                            </span>
                <span v-else :class="info.now_price - info.buyOrderPrice>0?'red':'green'">
                                {{info?info.now_price:'-'}}
                            </span>
              </el-col>
              <el-col v-else :span="8">
                卖价：
                <span>
                                {{info?info.sellOrderPrice:'-'}}
                            </span>
              </el-col>
              <el-col v-if="info" class="text-right" :span="16">
                浮动盈亏：
                <span v-if="info.now_price == 0 && !info.sellOrderPrice">
                                -
                            </span>
                <span v-else :class="info.allProfitAndLose>0?'red number':'green number'">
                                {{info?info.profitAndLose:'-'}}
                            </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                买入价格：
                <span>
                                {{info?info.buyOrderPrice:'-'}}
                            </span>
              </el-col>
              <el-col class="text-center" :span="8">
                买入数量：
                <span>
                                {{info?info.orderNum:'-'}}
                            </span>
              </el-col>
              <el-col v-if="info" :span="8" class="text-right">
                方向：
                <span>
                                {{info?info.orderDirection:'-'}}
                                <i v-if="info.orderDirection == '买涨'" class="iconfont icon-up"></i>
                                <i v-if="info.orderDirection == '买跌'" class="iconfont icon-down"></i>
                            </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                杠杆倍数：
                <span>
                                {{info?info.orderLever:'-'}}
                            </span>
              </el-col>
              <el-col class="text-center" :span="8">
                总市值：
                <span>
                                {{info?info.orderTotalPrice:'-'}}
                            </span>
              </el-col>
              <el-col class="text-right" :span="8">
                留仓天数：
                <span>
                                {{info?info.orderStayDays:'-'}}
                            </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                手续费：
                <span>
                                {{info?info.orderFee:'-'}}
                            </span>
              </el-col>
              <el-col class="text-center" :span="8">
                印花税：
                <span>
                                {{info?info.orderSpread:'-'}}
                            </span>
              </el-col>
              <el-col :span="8" class="text-right">
                留仓费：
                <span>
                                {{info?info.orderStayFee:'-'}}
                            </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                持仓id：
                <span>
                                {{info?info.id:'-'}}
                            </span>
              </el-col>
            </el-row>
            <el-row class="auxiliary">
              <el-col :span="12">
                买入订单号：
                <span>{{info?info.buyOrderId:'-'}}</span>
              </el-col>
              <el-col class="text-right" :span="12">
                买入时间：
                <span v-if="info && info.buyOrderTime">
                                {{info.buyOrderTime | timeFormat}}
                            </span>
                <span v-else></span>
              </el-col>
            </el-row>
            <el-row class="auxiliary">
              <el-col v-if="info && info.sellOrderId" :span="12">
                卖出订单号：
                <span>{{info.sellOrderId}}</span>
              </el-col>
              <el-col v-if="info && info.sellOrderTime" class="text-right" :span="12">
                卖出时间：
                <span v-if="info && info.sellOrderTime">
                                {{info.sellOrderTime | timeFormat}}
                            </span>
                <span v-else></span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="auxiliary" :span="24">
                持仓订单号：
                <span>
                                {{info?info.positionSn:'-'}}
                            </span>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <div class="text box-content">

        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    info: {
      type: Object,
      default: function () {
        return {
          accountType: 0,
          agentId: 1,
          agentName: '总代理',
          enableAmt: 11266.34,
          id: 11,
          idCard: '132567788432',
          isActive: 2,
          isLock: 0,
          phone: '18163912132',
          profitAndLose: 0,
          realName: '认证',
          regAddress: '局域网',
          riskRate: 1,
          userAmt: 11266.34
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
