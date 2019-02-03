<template>
  <el-container>
    <!-- nav -->
    <el-header>
     <Header/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <sidebar/>
      </el-aside>
      <el-main>
        <!-- mian -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/layout/headers.vue'
import sidebar from "@/layout/sidebar.vue";
export default {
  components: {
    Header,
    sidebar
  }
};
</script>

<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  padding: 0;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
}
</style>
