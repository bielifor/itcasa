<template>
  <el-card class="box-card">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData()"></el-button>
        </el-input>
      </el-col>&nbsp;&nbsp;
      <el-button type="success" @click="addDialog = true">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!-- scope相当于datalist数据 -->
          <!-- {{scope.row.id}} -->
          <el-switch
            @change="statuChange(scope.row.id, scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <!-- {{scope.row.id}} -->
            <el-button
              size="mini"
              @click="openEidt(scope.row.id)"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              @click="del(scope.row.id)"
              icon="el-icon-delete"
              circle
            ></el-button>
            <el-button
              size="mini"
              plain
              type="success"
              icon="el-icon-check"
              @click="openRole(scope.row.id)"
              circle
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @current-change="currentchange"
      @size-change="sizechange"
      :current-page="pagenum"
      :page-sizes="[5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加面板 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input type="password" v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCanle">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑面板 -->
    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editObj.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input type="email" v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input type="mobile" v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="addEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色面板 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form :model="roleObj">
        <el-form-item label="当前用户" label-width="100px">
          <el-input v-model="roleObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配角色" label-width="100px">
          <!-- 
            el-select：
            el-option：下拉选项
            label: 显示的文本
            value：文本对应的 value 值
          -->
          {{ roleObj.rid }}
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option :disabled="true" label="请选择角色" :value="-1"></el-option>
            <el-option
              v-for="item in dropData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框中的数据
      search: "",
      // 分页的当前页
      pagenum: 1,
      // 分页的页容量
      pagesize: 5,
      // 表格的数据
      dataList: [],
      // 数据的总条数
      total: 0,
      // 添加控制面板
      addDialog: false,
      // 添加面板中的数据
      addObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑控制面板
      editDialog: false,
      editObj: {},
      roleDialog: false,
      // 分配角色面板中的数据
      roleObj: {},
      // 下拉框中的数据
      dropData: []
    };
  },
  methods: {
    async getAlllist() {
      var res = await this.$http.get(
        `/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`,
        {
          headers: {
            Authorization: window.localStorage.getItem("token")
          }
        }
      );
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.dataList = data.users;
        this.total = data.total;
      }
    },
    sizechange(size) {
      this.pagesize = size;
      this.getAlllist();
    },
    currentchange(num) {
      this.pagenum = num;
      this.getAlllist();
    },
    searchData() {
      this.getAlllist();
    },
    async add() {
      var res = await this.$http.request({
        url: "/users",
        method: "post",
        data: {
          username: this.addObj.username,
          password: this.addObj.password,
          email: this.addObj.email,
          mobile: this.addObj.mobile
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
        this.getAlllist();
      } else {
        this.$message.error(meta.msg);
      }
      this.clearObj(this.addObj);
      this.addDialog = false;
    },
    // 清空对象
    clearObj(obj) {
      for (var item in obj) {
        obj[item] = "";
      }
    },
    // 关闭添加面板
    addCanle() {
      this.addDialog = false;
      this.clearObj(this.addObj);
    },
    // 当开关状态改变时,执行的函数
    async statuChange(id, state) {
      var res = await this.$http.request({
        url: `/users/${id}/state/${state}`,
        method: "put",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      console.log(res);
      var { meta } = res.data;
      if (meta.status == 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 点击修改按钮打开面板,填充默认数据
    async openEidt(id) {
      this.editDialog = true;
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.editObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 提交修改过后的数据
    async addEdit() {
      var res = await this.$http.request({
        url: `/users/${this.editObj.id}`,
        method: "put",
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      }
      this.getAlllist();
      this.editDialog = false;
    },
    // 删除数据
    async del(id) {
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: "delete",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      }
      this.getAlllist();
    },
    // 打开分配角色面板 填充数据
    async openRole(id) {
      this.roleDialog = true;
      this.getDropDown();
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.roleObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 动态得到下拉框中的数据
    async getDropDown() {
      var res = await this.$http.request({
        url: "roles",
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.dropData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 提交分配角色后的数据
    async addRole() {
      // 用户的 id
      var id = this.roleObj.id;
      // 分配的角色 id
      var rid = this.roleObj.rid;
      // 发送请求
      var res = await this.$http.request({
        url: `/users/${id}/role`,
        method: "put",
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        data: {
          rid: rid
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
      this.roleDialog = false;
    }
  },
  mounted() {
    this.getAlllist();
  }
};
</script>

<style>
.el-pagination {
  margin-top: 15px;
}
</style>
