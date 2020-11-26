<template>
    <div class="wrapper">
        <el-dialog
            title="修改订单后台备注"
            :visible.sync="dialogVisible"
            width="50%">
            <div>
                <el-form :inline="false" :model="form" ref="ruleForm" label-width="80px" :rules="rule">
                    <el-form-item label="备注" prop="orderAdminDesc">
                        <el-input  type="textarea" v-model="form.orderAdminDesc" placeholder="备注"></el-input>
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
    orderAdminDesc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        chargeId: this.info, // 充值id
        orderAdminDesc:  this.orderAdminDesc,  // 备注
      },
      rule: {}
    }
  },
  watch: {
      info(val) {
          this.form.chargeId = val;
      },
      orderAdminDesc(val) {
          this.form.orderAdminDesc = val;
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
              orderAdminDesc: this.form.orderAdminDesc,
            }
            let data = await api.updateOrderAdminDesc(opts)
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
              message: '取消'
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