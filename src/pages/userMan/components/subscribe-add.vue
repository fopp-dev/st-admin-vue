<template>
  <div class="wrapper">
    <el-dialog
      title="添加新股申购"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :model="form" ref="ruleForm" size="mini" label-width="100px" :rules="rule">
          <el-form-item label="申购用户" prop="userId">
            <el-select filterable v-model="form.userId" placeholder="申购用户">
              <el-option v-for="i in userList" :key="i.key"  :label="(i.realName == null ? '' : i.realName) + ' /' + i.phone " :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申购备注">
            <el-input type="textarea" rows="3" v-model="form.remarks" placeholder="备注"></el-input>
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
        userId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.getUserManList()
  },
  methods: {
    async getUserManList () {
      // 获取用户数据
      let opts = {
        pageNum: 1,
        pageSize: 9999
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
            remarks: this.form.remarks,
            userId: this.form.userId,
            id: 0
          }
          let data = await api.saveStockSubscribe(opts)
          if (data.status === 0) {
            this.$message.success('添加成功')
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
