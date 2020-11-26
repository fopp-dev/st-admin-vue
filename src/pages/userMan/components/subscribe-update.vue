<template>
  <div class="wrapper">
    <el-dialog
      title="修改新股申购"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :model="form" ref="ruleForm" size="mini" label-width="100px" :rules="rule">
          <el-form-item label="用户名">
            {{form.realName}}
          </el-form-item>
          <el-form-item label="手机号">
            {{form.phone}}
          </el-form-item>
          <el-form-item label="提交金额">
            <el-input type="text" v-model="form.submitAmount" placeholder="提交金额"></el-input>
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
      type: Object,
      default: function () {
        return {
          id: ''
        }
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        realName: '',
        phone: '',
        submitAmount: '',
        id: ''
      },
      rule: {
        userId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    info (newval) {
      if (newval) {
        this.form.phone = this.info.phone
        this.form.realName = this.info.realName
        this.form.submitAmount = this.info.submitAmount
        this.form.id = this.info.id
      }
    }
  },
  computed: {},
  created () {},
  mounted () {
  },
  methods: {
    
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            submitAmount: this.form.submitAmount,
            id: this.form.id
          }
          let data = await api.saveStockSubscribe(opts)
          if (data.status === 0) {
            this.$message.success('修改成功')
            this.getDate()
          } else {
            this.$message.error(data.msg)
          }
          this.dialogVisible = false
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
