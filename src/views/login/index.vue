<template>
  <div>
    <el-container>
      <el-header>
        <div style="text-align: center; font-size: 25px; font-weight: bolder">
          <i class="el-icon-s-home" style="margin-right: 25px"></i>
          学生管理系统
        </div>
      </el-header>
      <el-main style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);">
        <el-card class="login-module" style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);">
          <div slot="header" class="clearfix">
            <span style="text-align: center; font-size: 20px; font-family: 'Microsoft YaHei'">
              <p><i class="el-icon-office-building" style="margin-right: 18px"></i>登陆</p>
            </span>
          </div>
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户号" prop="userNumber">
                <el-input v-model="ruleForm.userNumber" prefix-icon="el-icon-user"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" prefix-icon="el-icon-user"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" prop="password">
                <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"
                  @keyup.enter="submitForm('ruleForm')"></el-input>
              </el-form-item>
              <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="ruleForm.type">
                  <el-radio label="student" value="student">学生</el-radio>
                  <el-radio label="teacher" value="teacher">老师</el-radio>
                  <el-radio label="admin" value="admin">admin</el-radio>
                </el-radio-group>
              </el-form-item>


              <el-row :gutter="20" style="display: flex; justify-content: center;">
                <el-col :span="8">
                  <div style="width: 70px;"></div> <!-- 添加一个空的 div，宽度为 50px -->
                  <el-input v-model="input" placeholder="请输入验证码" @keyup.enter="submitForm('ruleForm')"></el-input>
                </el-col>
                <el-col :span="6">
                  <span @click="refreshCode" style="cursor: pointer;">
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </span>
                </el-col>
              </el-row>



              <el-row :gutter="0">
                <el-col :span="12">
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%">登陆</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-button @click="register" style="width: 100%">注册</el-button>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-form-item>
                <div style="display: flex; justify-content: flex-end;">
                  <el-button type="text" @click="goToUpdatePassword">忘记密码？</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// 引入图片验证码组件
import SIdentify from '@/components/identify'
export default {
  components: { SIdentify },
  data() {
    return {
      input: '',
      // 图片验证码
      identifyCode: '',
      // 验证码规则
      identifyCodes: '3456789ABCDEFGHGKMNPQRSTUVWXY',
      ruleForm: {
        identifyCode: '',// 输入框中的验证码
        userNumber: null,
        username: null, // 修改
        password: null,
        email: null,
        phone: null,
        type: null,
      },
      rules: {
        userNumber: [
          { required: true, message: '请输入用户号', trigger: 'blur' },
          { pattern: /^\d{10}$/, message: '请输入10位数字作为用户号', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
      },
    };
  },
  computed: {
    // 计算属性，判断输入框中的值是否与验证码相同
    isIdentifyCodeCorrect() {
      return this.input === this.identifyCode;
    }
  },
  mounted() {
    // 在组件加载后添加键盘事件监听器
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    // 在组件销毁前移除键盘事件监听器，以避免内存泄漏
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    // 处理键盘按下事件
    handleKeyDown(event) {
      // 如果按下的是 Enter 键（keyCode 为 13），则调用提交表单方法
      if (event.keyCode === 13) {
        this.submitForm('ruleForm');
      }
    },
    goToUpdatePassword() {
      this.$router.push('/resetPassword');
    },

    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          Math.floor(Math.random() * (this.identifyCodes.length - 0) + 0)
        ]
      }
    },
    submitForm(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 添加密码长度检查逻辑
          if (that.ruleForm.password.length < 5) {
            that.$message({
              showClose: true,
              message: '密码长度不能少于5位',
              type: 'error'
            });
            return;
          }

          // 验证码验证逻辑
          if (that.input !== that.identifyCode) {
            that.$message({
              showClose: true,
              message: '验证码错误',
              type: 'error'
            });
            return;
          }

          // 发送请求获取当前学期
          axios.get('http://localhost:10086/info/getCurrentTerm')
            .then(function (resp) {
              // 获取到后端返回的当前学期值
              const currentTerm = resp.data;
              // 将当前学期值存储在前端的 sessionStorage 中
              sessionStorage.setItem("currentTerm", currentTerm);
            })
            .catch(function (error) {
              // 处理请求错误的逻辑
              console.error("获取当前学期信息失败：" + error);
              // 可以在这里给出错误提示，比如弹出消息框
              that.$message({
                showClose: true,
                message: '获取当前学期信息失败，请稍后再试',
                type: 'error'
              });
            });



          // 表单验证通过后，进行登录逻辑
          if (that.ruleForm.type === 'admin' || that.ruleForm.type === 'teacher') {
            let form = { username: that.ruleForm.username, password: that.ruleForm.password };
            axios.post("http://localhost:10086/teacher/login", form).then(function (resp) {
              console.log("教师登陆验证信息：" + resp.data);
              let check = resp.data;
              if (check === true) {
                // 登录成功后的逻辑...
                axios.get("http://localhost:10086/teacher/findByUsername/" + that.ruleForm.username).then(function (resp) {
                  console.log("登陆页正在获取用户信息" + resp.data);
                  let name = resp.data.tname;
                  let email = resp.data.email;
                  let phone = resp.data.phone;
                  let avatar = resp.data.avatar;

                  sessionStorage.setItem("token", 'true');
                  sessionStorage.setItem("type", that.ruleForm.type);
                  sessionStorage.setItem("name", name);
                  sessionStorage.setItem("email", email);
                  sessionStorage.setItem("phone", phone);
                  sessionStorage.setItem("tid", resp.data.tid);
                  sessionStorage.setItem("avatar", avatar);

                  if (that.ruleForm.type === 'admin' && name === 'admin') {
                    that.$message({
                      showClose: true,
                      message: '登陆成功，欢迎 ' + name + '!',
                      type: 'success'
                    });
                    that.$router.push('/admin');
                  } else if (that.ruleForm.type === 'teacher' && name !== 'admin') {
                    that.$message({
                      showClose: true,
                      message: '登陆成功，欢迎 ' + name + '!',
                      type: 'success'
                    });
                    that.$router.push('/teacher');
                  } else {
                    that.$message({
                      showClose: true,
                      message: 'admin 登陆失败，检查登陆类型',
                      type: 'error'
                    });
                  }
                });
              } else {
                // 登录失败后的逻辑...
                that.$message({
                  showClose: true,
                  message: '登陆失败，检查账号密码',
                  type: 'error'
                });
              }
            }).catch(function (error) {
              console.error("教师登陆验证错误：" + error);
              // 处理登录验证错误的逻辑...
            });
          } else if (that.ruleForm.type === 'student') {
            let form = { username: that.ruleForm.username, password: that.ruleForm.password };
            axios.post("http://localhost:10086/student/login", form).then(function (resp) {
              console.log("学生登陆验证信息：" + resp.data);
              let check = resp.data;
              if (check === true) {
                // 登录成功后的逻辑...
                axios.get("http://localhost:10086/student/findByUsername/" + that.ruleForm.username).then(function (resp) {
                  console.log("登陆页正在获取用户信息" + resp.data);
                  let name = resp.data.sname;
                  let email = resp.data.email;
                  let phone = resp.data.phone;
                  let avatar = resp.data.avatar;

                  sessionStorage.setItem("token", 'true');
                  sessionStorage.setItem("type", that.ruleForm.type);
                  sessionStorage.setItem("name", name);
                  sessionStorage.setItem("email", email);
                  sessionStorage.setItem("phone", phone);
                  sessionStorage.setItem("sid", resp.data.sid);
                  sessionStorage.setItem("avatar", avatar);

                  that.$message({
                    showClose: true,
                    message: '登陆成功，欢迎 ' + name + '!',
                    type: 'success'
                  });

                  // 跳转到学生页面
                  that.$router.push({
                    path: '/student',
                    query: {}
                  });
                });
              } else {
                // 登录失败后的逻辑...
                that.$message({
                  showClose: true,
                  message: '账号密码错误，请联系管理员',
                  type: 'error'
                });
              }
            }).catch(function (error) {
              console.error("学生登陆验证错误：" + error);
              // 处理登录验证错误的逻辑...
            });
          } else {
            console.log("! error type");
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    register() {
      // 跳转到注册页面
      this.$router.push('/register');
    },

  }
}
</script>

<style>
.login-module {
  /*width: 380px;*/
  /*height: 325px;*/
  margin-top: 60px;
  /*border: none;*/
  position: absolute;
  right: 500px;
  text-align: center;
  width: 30%;
}

/* 定义 CSS 变量 */
:root {
  --main-color: #3498db;
  --secondary-color: #f0f0f0;
  --text-color: #333;
  --input-bg-color: #f7f7f7;
  --input-border-color: #ddd;
  --input-focus-border-color: var(--main-color);
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.send-code-info {
  margin-bottom: 20px;
  /* 调整与下面一行的间距 */
}

.verification-code {
  display: flex;
  justify-content: space-between;
  /* 靠右对齐 */
}
</style>
