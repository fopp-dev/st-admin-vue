<template>
    <div class="wrapper">
        <el-dialog
            title="修改前台订单备注"
            :visible.sync="dialogVisible"
            width="50%">
            <div>
                <el-form :inline="false" :model="form" ref="ruleForm" label-width="80px" :rules="rule">
                    <el-form-item label="备注" prop="orderDesc">
                        <el-input  type="textarea" v-model="form.orderDesc" placeholder="备注"></el-input>
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
    },
    info: {
      type: Number,
      default: 0
    },
    orderDesc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        chargeId: this.info, // 充值id
        orderDesc:  this.orderDesc,  // 备注
      },
      rule: {}
    }
  },
  watch: {
      info(val) {
          this.form.chargeId = val;
      },
      orderDesc(val) {
          this.form.orderDesc = val;
      }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$confirm('确认修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let opts = {
              chargeId: this.form.chargeId,
              orderDesc: this.form.orderDesc,
            }

            let data = await api.updateOrderDesc(opts)
            if (data.status === 0) {
              this.$message.success('修改成功')
              this.getDate()
            } else {
              this.$message.error(data.msg)
            }
            this.form.orderDesc = '';
            this.dialogVisible = false
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '取消11'
            })
            this.form.orderDesc = '';
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