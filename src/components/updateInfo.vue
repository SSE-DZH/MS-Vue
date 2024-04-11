<template>
  <el-container>
    <el-main>
      <el-car>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" :value="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" :value="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" :value="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
            <!-- 使用 flex 布局将按钮靠右 -->
            <div style="display: flex; justify-content: flex-end;">
              <el-button type="text" @click="showForgetPasswordDialog">忘记密码？</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-car>
    </el-main>
    <!-- 忘记密码对话框 -->
    <el-dialog title="找回密码" :visible.sync="forgetPasswordDialogVisible" width="30%">
      <div class="send-code-info">
        <span>向 {{ ruleForm.email }} 发送验证码</span>
      </div>
      <div class="verification-code">
        <el-input v-model="verificationCode" placeholder="请输入验证码"></el-input>
        <el-button :disabled="countdown > 0" @click="sendVerificationCode">{{ countdown > 0 ? countdown + 's后重新发送' :
          '发送验证码' }}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeForgetPasswordDialog">取消</el-button>
        <el-button type="primary" @click="confirmForgetPassword">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        name: sessionStorage.getItem('name') || '',
        email: sessionStorage.getItem('email') || '',
        phone: sessionStorage.getItem('phone') || ''
      },
      rules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: this.validatePass2, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名字不能为空', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      forgetPasswordDialogVisible: false, // 控制忘记密码对话框显示与隐藏
      verificationCode: '', // 验证码
      countdown: 0 // 倒计时
    };
  },
  methods: {
    validatePass2(rule, value, callback) {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const that = this;
          sessionStorage.setItem('name', that.ruleForm.name);
          sessionStorage.setItem('email', that.ruleForm.email);
          sessionStorage.setItem('phone', that.ruleForm.phone);
          const type = sessionStorage.getItem('type');
          let form = null;
          let ss = null;
          if (type === 'student') {
            ss = 'Student';
            form = {
              sid: sessionStorage.getItem('sid'),
              sname: that.ruleForm.name,
              password: that.ruleForm.pass,
              email: that.ruleForm.email,
              phone: that.ruleForm.phone
            };
          } else {
            ss = 'Teacher';
            form = {
              tid: sessionStorage.getItem('tid'),
              tname: that.ruleForm.name,
              password: that.ruleForm.pass,
              email: that.ruleForm.email,
              phone: that.ruleForm.phone
            };
          }

          axios.post('http://localhost:10086/' + type + '/update' + ss, form).then(function (resp) {
            if (resp.data === true) {
              that.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              });
            } else {
              that.$message.error('编辑失败，联系管理员');
            }
            that.$router.push("/" + type + 'Home');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 显示忘记密码对话框
    showForgetPasswordDialog() {
      this.forgetPasswordDialogVisible = true;
    },
    // 关闭忘记密码对话框
    closeForgetPasswordDialog() {
      this.forgetPasswordDialogVisible = false;
    },
    // 发送验证码
    sendVerificationCode() {
      // 发送验证码逻辑，这里只是示例，需要根据实际情况实现
      // 设置倒计时为60秒
      this.countdown = 60;
      // 倒计时逻辑
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    },
    // 确认找回密码
    confirmForgetPassword() {
      // 确认找回密码逻辑，根据验证码进行密码重置等操作
      // 这里可以添加验证验证码的逻辑
      // 关闭忘记密码对话框
      this.closeForgetPasswordDialog();
    }
  }
};
</script>


<style scoped>
.send-code-info {
  margin-bottom: 20px; /* 调整与下面一行的间距 */
}

.verification-code {
  display: flex;
  justify-content: space-between; /* 靠右对齐 */
}
</style>