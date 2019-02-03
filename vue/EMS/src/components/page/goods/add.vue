<template>
  <el-card>
    <!-- 面包屑导航 -->
    <mybread firstnav="商品管理" lastnav="商品列表"/>
    <!-- 警告框 -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <el-steps class="mysteps" :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="tabclick" tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form label-position="top" :model="addObj" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称">
            <el-input type="text" v-model="addObj.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 
             expand-trigger：触发子选项的条件
             options：数据源
            -->
            {{ cateData }}
            <el-cascader
              expand-trigger="hover"
              :props="props"
              :options="cateList"
              v-model="cateData"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
          <div v-for="item in manyParams" :key="item.attr_id">
              <p>{{item.attr_name}}</p>
              <div>
                  <el-checkbox v-for="(item1, index) in item.attr_vals.split(',')" :key="index" v-model="checked" :label="item1" border></el-checkbox>
              </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      checked: true,
      addObj: {},
      // 双向绑定给级联框的数据
      cateData: [],
      // 设置级联框配置项
      props: {
        value: "cat_id",
        label: "cat_name"
      },
      // 所有的分类数据
      cateList: [],
      // 动态参数
      manyParams: []
    };
  },
  methods: {
    tabclick(e) {
      this.active = Number(e.index)
      if (e.index === "1") {
        this.getManyParams()
      }
    },
    async getAllCate() {
      var res = await this.$http.get(`/categories?type=3`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.cateList = data
      } else {
        this.$message.error(mets.msg)
      }
    },
    async getManyParams() {
        if (this.cateData.length === 0) {
            this.$message.error('请选择商品分类')
            return
        }
        var id = this.cateData[this.cateData.length - 1]
        var res = await this.$http.get(`/categories/${id}/attributes?sel=many`)
            var { meta, data } = res.data
            if (meta.status === 200) {
                console.log(data)
                this.manyParams = data
            } else {
                this.$message.error(meta.msg)
            }
    }
  },
  mounted() {
    this.getAllCate()
  }
}
</script>

<style>
.myalert {
    margin: 15px 0;
}

.el-step__title {
    font-size: 12px;
}
.el-tab-pane div{
    margin-top: 18px;
}
</style>
