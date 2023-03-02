<template>
  <div class="component-content">
    <el-card class="box-card">
      <h2>Admin Login</h2>
      <el-form :model="loginForm">
        <el-form-item label="User Name" prop="user">
          <el-input v-model="loginForm.user" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="loginForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="flex-center">
          <el-button type="primary" @click="onLogin()">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        user: '',
        password: '',
      },
    }
  },
  methods: {
    onLogin() {
    },
  },
}
</script>
<style lang="scss">
.component-content {
  padding-top: 30px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.box-card {
  width: 400px;
}
.flex-center {
  display: flex;
  justify-content: center;
}
</style>
