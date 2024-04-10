<template>
    <div>
      <el-container>
        <el-header>
          <div style="text-align: center; font-size: 25px; font-weight: bolder">
            <i class="el-icon-s-home" style="margin-right: 25px"></i>
            学生管理系统
          </div>
        </el-header>
        <el-main class="custom-main">
          <el-card class="login-module">
            <div slot="header" class="clearfix">
              <span style="text-align: center; font-size: 20px; font-family: 'Microsoft YaHei'">
                <p><i class="el-icon-office-building" style="margin-right: 18px"></i>注册</p>
              </span>
            </div>
            <div>
              <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px"
                class="register-form">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
  
                <!-- 用户密码 -->
                <el-form-item label="用户密码" prop="password">
                  <el-input v-model="registerForm.password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
  
                <!-- 再次输入用户密码 -->
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码"
                    show-password></el-input>
                </el-form-item>
  
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
  
                <!-- 手机号 -->
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
  
                <!-- 用户类型 -->
                <el-form-item label="用户类型" prop="type">
                  <el-radio-group v-model="registerForm.type">
                    <el-radio label="student" value="student">学生</el-radio>
                    <el-radio label="teacher" value="teacher">老师</el-radio>
                    <el-radio label="admin" value="admin">admin</el-radio>
                  </el-radio-group>
                </el-form-item>
  
                <!-- 发送验证码按钮 -->
                <el-form-item label="验证码" prop="verificationCode">
                  <div class="verification-code">
                    <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码"></el-input>
                    <el-button :disabled="countdown > 0" @click="sendVerificationCode">
                      {{ countdown > 0 ? countdown + 's后重新发送' : '发送验证码' }}
                    </el-button>
                  </div>
                </el-form-item>
  
                <!-- 提交和重置按钮 -->
                <el-form-item>
                  <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
                  <el-button @click="resetForm('registerForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        registerForm: {
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          phone: '',
          type: '',
          verificationCode: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, message: '密码长度不能少于5位', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: this.validateConfirmPassword, trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
          ],
          phone: [
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          verificationCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        countdown: 0
      };
    },
    methods: {
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
  
      // 添加密码确认校验逻辑
      validateConfirmPassword(rule, value, callback) {
        if (value !== this.registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
  
      // 提交注册表单
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 添加密码长度检查逻辑
            if (this.registerForm.password.length < 5) {
              this.$message({
                showClose: true,
                message: '密码长度不能少于5位',
                type: 'error'
              });
              return;
            }
  
            // 发送请求获取当前学期
            axios.get('http://localhost:10086/info/getCurrentTerm')
              .then(resp => {
                // 获取到后端返回的当前学期值
                const currentTerm = resp.data;
                // 将当前学期值存储在前端的 sessionStorage 中
                sessionStorage.setItem("currentTerm", currentTerm);
              })
              .catch(error => {
                // 处理请求错误的逻辑
                console.error("获取当前学期信息失败：" + error);
                // 可以在这里给出错误提示，比如弹出消息框
                this.$message({
                  showClose: true,
                  message: '获取当前学期信息失败，请稍后再试',
                  type: 'error'
                });
              });
  
            // 表单验证通过后，进行注册逻辑
            // Your registration logic here...
  
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
  </script>

<style scoped>
.verification-code {
    display: flex;
    align-items: center;
}

.verification-code el-input {
  flex: 1;
}

.custom-main {
    margin-top: -30px;
    /* 设置上外边距 */
    margin-bottom: 10px;
    /* 设置下外边距 */
}
</style>