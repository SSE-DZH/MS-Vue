<template>
    <div>
        <el-container>
            <el-header>
                <div style="text-align: center; font-size: 25px; font-weight: bolder">
                    <i class="el-icon-s-home" style="margin-right: 25px"></i>
                    学生管理系统
                </div>
            </el-header>
            <el-main>
                <el-card class="login-module" style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);">
                    <div slot="header" class="clearfix">
                        <span style="text-align: center; font-size: 20px; font-family: 'Microsoft YaHei'">
                            <p><i class="el-icon-office-building" style="margin-right: 18px"></i>修改密码</p>
                        </span>
                    </div>
                    <div>
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                            class="demo-ruleForm">
                            <el-form-item label="用户号" prop="userNumber">
                                <el-input v-model="ruleForm.userNumber" :value="ruleForm.userNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="username">
                                <el-input v-model="ruleForm.username" :value="ruleForm.username"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="pass">
                                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="checkPass">
                                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- 用户类型 -->
                            <el-form-item label="用户类型" prop="type">
                                <el-radio-group v-model="ruleForm.type">
                                    <el-radio label="student" value="student">学生</el-radio>
                                    <el-radio label="teacher" value="teacher">老师</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- 发送验证码按钮 -->
                            <el-form-item label="验证码" prop="verificationCode">
                                <div class="verification-code">
                                    <el-input v-model="ruleForm.verificationCode" placeholder="请输入邮箱验证码"></el-input>
                                    <el-button :disabled="countdown > 0" @click="sendVerificationCode">
                                        {{ countdown > 0 ? countdown + 's后重新发送' : '发送验证码' }}
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                                <el-button @click="resetForm('ruleForm')">重置</el-button>
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
            ruleForm: {
                pass: '',
                checkPass: '',
                username: '',
                userNumber: null,
                type: '',
                verificationCode: '', // 验证码
            },
            rules: {
                userNumber: [
                    { required: true, message: '请输入用户号', trigger: 'blur' },
                    { pattern: /^\d{10}$/, message: '请输入10位数字作为用户号', trigger: 'blur' }
                ],
                pass: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: this.validatePass2, trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '名字不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                verificationCode: [
                    { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
                    { min: 6, max: 6, message: '验证码长度必须为6位', trigger: 'blur' } // 添加长度限制
                ]
            },
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
        // 发送验证码
        sendVerificationCode() {
            // 根据用户类型构造获取邮箱地址的API地址
            const apiUrl = this.ruleForm.type === 'teacher' ?
                'http://localhost:10086/teacher/findEmailByUsername' :
                'http://localhost:10086/student/findEmailByUsername';

            // 调用后端API获取邮箱地址
            axios.get(apiUrl, { params: { username: this.ruleForm.username } })
                .then(response => {
                    // 判断后端返回的结果
                    if (response.data.code === 1) {
                        // 获取邮箱地址成功，构造请求参数对象
                        const params = { email: response.data.data };

                        // 根据用户类型构造发送验证码的API地址
                        const sendUrl = this.ruleForm.type === 'teacher' ?
                            'http://localhost:10086/teacher/sendEailCode' :
                            'http://localhost:10086/student/sendEailCode';

                        // 发送验证码
                        axios.post(sendUrl, null, { params })
                            .then(response => {
                                // 判断后端返回的结果
                                if (response.data.code === 1) {
                                    // 发送验证码成功，显示成功消息给用户
                                    this.$message({
                                        showClose: true,
                                        message: "发送验证码成功",
                                        type: 'success'
                                    });
                                    // 发送成功后提交表单
                                    this.submitForm('ruleForm');
                                } else {
                                    // 发送验证码失败，显示失败消息给用户
                                    this.$message({
                                        showClose: true,
                                        message: response.data.msg,
                                        type: 'error'
                                    });
                                }
                            })
                            .catch(error => {
                                // 处理发送验证码失败的逻辑
                                console.error('发送验证码失败:', error);
                            });
                    } else {
                        // 获取邮箱地址失败，显示失败消息给用户
                        this.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(error => {
                    // 处理获取邮箱地址失败的逻辑
                    console.error('获取邮箱地址失败:', error);
                });

            // 设置倒计时为60秒
            this.countdown = 60;
            // 设置发送验证码按钮为禁用状态
            this.canSendVerificationCode = false;
            // 倒计时逻辑
            const timer = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    clearInterval(timer);
                    // 倒计时结束后，设置发送验证码按钮为可用状态
                    this.canSendVerificationCode = true;
                }
            }, 1000);
        },


        // 提交注册表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 构造请求数据对象
                    const requestData = {
                        username: this.ruleForm.username,
                        password: this.ruleForm.pass,
                        verificationCode: this.ruleForm.verificationCode
                    };

                    // 根据用户类型选择访问学生或老师的修改密码接口
                    let url = '';
                    if (this.ruleForm.type === 'teacher') {
                        url = 'http://localhost:10086/teacher/updatePassword';
                    } else if (this.ruleForm.type === 'student') {
                        url = 'http://localhost:10086/student/updatePassword';
                    }

                    // 提交注册表单
                    axios.post(url, requestData)
                        .then(response => {
                            if (response.data.code === 1) {
                                // 修改密码成功，显示成功消息给用户
                                this.$message({
                                    showClose: true,
                                    message: '密码修改成功，请登录！',
                                    type: 'success'
                                });
                                // 密码修改成功后重定向到登录页面
                                this.$router.push({
                                    path: '/login'
                                });
                            } else {
                                // 修改密码失败，显示失败消息给用户
                                this.$message({
                                    showClose: true,
                                    message: response.data.msg,
                                    type: 'error'
                                });
                            }
                        })
                        .catch(error => {
                            // 处理修改密码失败的逻辑
                            console.error('密码修改失败:', error);
                            // 显示失败消息给用户
                            this.$message({
                                showClose: true,
                                message: '密码修改失败，请稍后再试',
                                type: 'error'
                            });
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    }
};
</script>


<style scoped></style>
