<template>
  <div class="wrapper">
    <el-dialog
      title="发送站内信"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :model="form" ref="ruleForm" size="mini" label-width="100px" :rules="rule">
          <el-form-item label="选择用户" prop="userId">
            <el-select filterable v-model="form.userId" placeholder="选择用户">
              <el-option label="所有用户" value="0"></el-option>
              <el-option v-for="i in userList" :key="i.key"  :label="i.realName + ' /' + i.phone " :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="发送内容" prop="remarks">
            <el-input type="textarea" rows="5" v-model="form.remarks" placeholder="备注"></el-input>
          </el-form-item>
          <div>
            所有用户表示给所有人都发送站内信
          </div>
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
    userList: {
      type: Array,
      default: function () {
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        remarks: '',
        userId: ''
      },
      rule: {
        remarks: [
          { required: true, message: '请输入发送内容', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请输选择用户', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      // 获取表格数据
      let opts = {
        userId: '',
        realName: '',
        phone: '',
        agentId: '',
        accountType: '',
        pageSize: 99999,
        pageNum: 1
      }
      let data = await api.getUserManList(opts)
      if (data.status === 0) {
        this.userList = data.data.list
      } else {
        this.$message.error(data.msg)
      }
    },
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            userId: this.form.userId,
            remarks: this.form.remarks
          }
          let data = await api.sendMsg(opts)
          if (data.status === 0) {
            this.$message.success('发送成功')
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
