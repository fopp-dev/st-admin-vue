<template>
  <div class="wrapper">
    <el-dialog
      title="添加充值订单"
      :visible.sync="dialogVisible"
      width="50%">
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="80px" :rules="rule" class="demo-form-inline">
          <el-form-item label="用户ID" prop="chargeId">
            <el-input v-model="form.userId" placeholder="用户ID" @input="searchNameLazy()"></el-input>
          </el-form-item>
          <el-form-item label="客户名字">
            <el-input :value="userInfo.realName" placeholder="客户名字" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值状态" prop="state">
            <el-select v-model="form.state" placeholder="充值状态">
              <el-option label="充值中" value="0"></el-option>
              <el-option label="充值成功" value="1"></el-option>
              <el-option label="充值失败" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="充值渠道" prop="state">
            <el-radio-group v-model="form.payChannel">
              <el-radio-button label="支付宝"></el-radio-button>
              <el-radio-button label="对公转账"></el-radio-button>
              <el-radio-button label="现金转账"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="充值金额" prop="amt">
            <el-input v-model="form.amt" placeholder="充值金额(正数为增加，负数为减少)"></el-input>
          </el-form-item>

          <el-form-item label="资金类型" prop="type">
              <el-select  v-model="form.type" placeholder="资金类型">
              <el-option label="本金" value="0"></el-option>
              <el-option label="A股" value="1"></el-option>
              <el-option label="港股" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="">
            <el-input v-model="form.orderDesc" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/axios/api'

export default {
  components: {},
  props: {
    getDate: {
      type: Function,
      default: function () {
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        userId: '',  // 用户id
        amt: '',     // 充值金额
        state: '1',  // 充值状态 ：0 充值中 1 充值成功 2 充值失败
        payChannel: '现金转账',  // 充值渠道
        orderDesc: '',   // 备注
        type: '0',   // 资金类型 0 本金  1  A股  2 港股
      },
      userInfo: {
        realName: '',
        agentName: '',
        accountType: '',
        enableAmt: '',
        userAmt: ''
      },
      rule: {
        userId: [
          { required: true, message: '请输入用户id', trigger: 'blur' }
        ],
        amt: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择充值状态', trigger: 'change' }
        ],
        payChannel: [
          { required: true, message: '请输入充值渠道', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入资金类型', trigger:'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    async searchName() {
      const opts = {
        userId: this.form.userId
      }
      const data = await api.getUserDetail(opts);
      if (data.status === 0) {
        if (data.data) {
          this.userInfo = data.data
        } else {
          this.$message.error('没有该用户!')
        }
      } else {
        this.$message.error(data.msg)
      }
      
    },

    searchNameLazy(){
      this.debounce(this.searchName,2000);
    },
    debounce (func, wait) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        func()
      }, wait)
    },
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$confirm('确认充值？此操作不可恢复', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let opts = {
              userId: this.form.userId,
              amt: this.form.amt,
              state: this.form.state,
              orderDesc: this.form.orderDesc,
              payChannel: this.form.payChannel === '支付宝' ? 0 : this.form.payChannel === '对公转账' ? 1 : this.form.payChannel,
              type: this.form.type
            }

            // console.log(opts);
            // return false;

            let data = await api.createOrder(opts)
            if (data.status === 0) {
              this.$message.success('创建成功')
              this.getDate()
            } else {
              this.$message.error(data.msg)
            }
            this.dialogVisible = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
