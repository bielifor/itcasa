<template>
  <div class="login">
    <div class="box">
      <h2>用户登录</h2>
      <el-form
        ref="myform"
        label-position="top"
        :model="loginObj"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginObj.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="mybtn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginObj: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.myform.validate(valid => {
        if (valid) {
          this.$http.post("/login", this.loginObj).then(data => {
            var { meta, data } = data.data;
            if (meta.status === 200) {
              console.log(data);
              this.$message({ message: "恭喜你，登录成功", type: "success" });
              window.localStorage.setItem('token', data.token)
              this.$router.push('/home')
            } else {
              this.$message.error({ message: "密码错误", type: "success" });
            }
          });
        } else {
          this.$message.error("参数不合法，请重新输入");
        }
      });
    }
  }
};
</script>

<style>
.login {
  background-color: #2c3742;
  width: 100%;
  height: 100%;
  position: relative;
}

.login .box {
  width: 500px;
  padding: 40px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login .box h2 {
  margin-bottom: 20px;
}
.login .box .mybtn {
  width: 100%;
}
</style>
