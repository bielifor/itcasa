<template>
  <el-card>
    <!-- 面白屑导航 -->
    <mybread firstnav="权限管理" lastnav="角色列表"/>
    <!-- 添加按钮 -->
    <el-button class="mybutton" @click="addRole">添加角色</el-button>
    <!-- table表格 -->
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 遍历生成一级权限 -->
          <!-- {{scope.row}} -->
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag
                @close="delRole(scope.row.id, item1.id, scope.row)"
                closable
              >{{item1.authName}}--{{item1.id}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="5">
                  <el-tag
                    @close="delRole(scope.row.id, item2.id, scope.row)"
                    type="success"
                    closable
                  >{{item2.authName}}--{{item2.id}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    type="warning"
                    @close="delRole(scope.row.id, item3.id, scope.row)"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}--{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          {{scope.row.id}}
          <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
          <el-button
            @click="openRole(scope.row.children, scope.row.id)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加面板 -->
    <el-dialog title="添加角色" :visible.sync="addroleDialog" width="30%">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input type="password" v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="roleDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限面板 -->
    <el-dialog title="分配权限" :visible.sync="roleDialog" width="30%">
      <el-tree
        ref="mytree"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultChecked"
        :default-expand-all="true"
        :props="props"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addroleDialog: false,
      addObj: {},
      props: {
        label: "authName",
        children: "children"
      },
      rightsList: [],
      // 默认选中的数组
      defaultChecked: [],
      roleDialog: false,
      // 设置当前角色的id
      roleId: ""
    };
  },
  methods: {
    async getAllRoles() {
      var res = await this.$http.request({
        url: "/roles",
        methods: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addRole() {
      this.addroleDialog = true
      var res = await this.$http.request({
        url: "roles",
        methods: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      })
    },
    async delRole(id, rid, rightData) {
      var res = await this.$http.request({
        url: `/roles/${id}/rights/${rid}`,
        method: "delete",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        })
        rightData.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 打开分配权限面板，设置默认选中的权限的选项
    openRole(rights, id) {
      this.defaultChecked = []
      this.roleDialog = true
      this.roleId = id
      this.getAllright()
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    // 得到所有权限的树状结构数据
    async getAllright() {
      var res = await this.$http.request({
        url: "/rights/tree",
        methos: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 设置权限
    async setRights() {
      var allcheck = this.$refs.mytree.getCheckedKeys()
      var halfcheck = this.$refs.mytree.getHalfCheckedKeys()
      var newArr = allcheck.concat(halfcheck)
      var rids = newArr.join(",")
      var res = await this.$http.request({
        url: `/roles/${this.roleId}/rights`,
        method: "post",
        data: {
          rids: rids
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.roleDialog = false
    }
  },
  mounted() {
    this.getAllRoles()
  }
}
</script>

<style>
.mybutton {
  margin-top: 10px;
  margin-bottom: 8px;
}
.el-tag {
  margin-top: 10px;
  margin-right: 6px;
}
</style>
