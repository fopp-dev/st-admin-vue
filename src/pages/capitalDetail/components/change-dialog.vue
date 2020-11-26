<template>
  <div class="wrapper">
    <el-dialog
      title="修改订单状态"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form :inline="true" :model="form" ref="ruleForm" label-width="80px" :rules="rule" class="demo-form-inline">
          <el-form-item label="订单ID" prop="chargeId">
            <el-input disabled v-model="info" placeholder="订单ID"></el-input>
          </el-form-item>
          <el-form-item label="充值状态" prop="state">
            <el-select v-model="form.state" placeholder="充值状态">
              <el-option label="充值成功" value="1"></el-option>
              <el-option label="充值失败" value="2"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item label="备注" prop="orderDesc">
                <el-input  type="textarea" v-model="form.orderDesc" placeholder="备注"></el-input>
            </el-form-item>

          <div>
          <el-form-item label="凭证">
            <img v-if="vouImage!=null" :src="form.vouImage" alt="" width="200" style="margin:0 auto;">
            <span v-else>暂无图片</span>
          </el-form-item>
          </div>

          <el-form-item label="重新上传" label-width="400">
                <el-upload
                  :with-credentials='true'
                  class="upload-demo"
                  :action="admin+'/admin/upload.do'"
                  :before-remove="beforeRemovelogo"
                  :on-success="handleSuccesslogo"
                  multiple
                  :limit="1"
                  name="upload_file"
                  :on-exceed="handleExceedlogo"
                  :file-list="fileListlogo">
                  <el-button size="small" type="primary">上传凭证</el-button>
                </el-upload>
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
import APIUrl from '@/axios/api.url' // 引入api.url.js

export default {
  components: {},
  props: {
    getDate: {
      type: Function,
      default: function () {
      }
    },
    info: {
      type: Number
    },
    vouImage:{
      type: String
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        chargeId: '',
        state: '',
        vouImage: this.newVouImage,// 凭证
        orderDesc:'' // 备注
      },
      rule: {
        // chargeId: [
        //     { required: true, message: '请输入订单号码', trigger: 'blur' },
        // ],
        state: [
          { required: true, message: '请选择充值状态', trigger: 'change' }
        ]
      },
      admin:'',
      fileListlogo: [],
    }
  },
  watch: {
    newVouImage(val) {
        this.form.vouImage = val;
    }
  },
  computed: {
    newVouImage(){
      return this.vouImage;
    }
  },
  created () {},
  mounted () {
    this.admin = APIUrl.baseURL
    if (this.admin === undefined) {
      this.admin = ''
    }

  },
  methods: {
    submit (formName) {
      // 提交
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let opts = {
            chargeId: this.info,
            state: this.form.state,
            vouImage:  this.form.vouImage,
            orderDesc: this.form.orderDesc
          }
          let data = await api.updateState(opts)
          if (data.status == 0) {
            this.$message.success('修改成功')
            this.form = {
              chargeId: '',
              state: '',
              vouImage: this.newVouImage,// 凭证
              orderDesc:'' // 备注
            },
            this.getDate()
          } else {
            this.$message.error(data.msg)
          }
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    handleExceedlogo (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemovelogo (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccesslogo (response, file, fileList) {
      this.form.vouImage = response.data.url
    },
  }
}
</script>
<style lang="less" scoped>
</style>
