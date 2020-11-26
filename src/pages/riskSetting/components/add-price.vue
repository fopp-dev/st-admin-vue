<template>
  <div class="wrapper">
    <el-dialog
      title="添加行情"
      :visible.sync="dialogVisible"
      width="50%">
      <div>
        <el-form :inline="true" label-width="100px" :model="form" ref="ruleForm" :rules="rule" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select clearable filterable  placeholder="类型">
              <el-option label="1min" value="1min"></el-option>
              <el-option label="5min" value="5min"></el-option>
              <el-option label="15min" value="15min"></el-option>
              <el-option label="30min" value="30min"></el-option>
              <el-option label="60min" value="60min"></el-option>
              <el-option label="1day" value="1day"></el-option>
            </el-select>
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
    priceList: {
      type: Array,
      default: function () {
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        typeName: '',
        unit: '',
        startInterval: '',
        endInterval: '',
        spreadRate: ''
      },
      rule: {
        typeName: [
          { required: false, message: '请选择类型', trigger: 'change' }
        ],
        // unit: [
        //   { required: true, message: '请输入单位', trigger: 'blur' }
        // ],
        // startInterval: [
        //   { required: true, message: '请输入开始区间', trigger: 'blur' }
        // ],
        // endInterval: [
        //   { required: true, message: '请输入结束区间', trigger: 'blur' }
        // ],
        // spreadRate: [
        //   { required: true, message: '请输入点差费率', trigger: 'blur' }
        // ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {},
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            typeName: this.form.typeName,
            unit: this.form.unit,
            startInterval: this.form.startInterval,
            endInterval: this.form.endInterval,
            spreadRate: this.form.spreadRate
          }
          let data = await api.addSiteSpread(opts)
          if (data.status === 0) {
            this.$message.success('添加成功')
            this.getDate()
            this.dialogVisible = false
          } else {
            this.$message.error(data.msg)
          }
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
