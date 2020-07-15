<template>
  <div id="app">
    <el-row class="tac">
      <el-col :span="4">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          @select="handleOpen"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          collapse
        >
          <el-menu-item :index="item.path" v-for="(item,index) in menus" :key="index">
            <i class="el-icon-edit"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      defaultActive: "/index",
      menus: [
        { path: "/index", title: "红色正方形" },
        { path: "/citypic", title: "城市关系图" },
        { path: "/gobang", title: "五子棋" }
      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      this.$router.push({ path: key });
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
