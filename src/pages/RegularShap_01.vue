<!-- 如何用向量和参数方程描述曲线？ -->
<template>
  <div>
    <canvas id="myCanvas" width="500" height="500" />
  </div>
</template>

<script>
import { parametric } from "../assets/javaScript/drawShap";
export default {
  components: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {
    const canvas = document.querySelector("#myCanvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const w = 0.5 * width,
      h = 0.5 * height;
    ctx.translate(w, h);
    ctx.scale(1, -1);

    // 抛物线参数方程
    const para = parametric(
      (t) => 25 * t,
      (t) => 25 * t ** 2
    );
    // 绘制抛物线
    para(-5.5, 5.5).draw(ctx);
    //绘制出阿基米德螺旋线
    const helical = parametric(
      (t, l) => l * t * Math.cos(t),
      (t, l) => l * t * Math.sin(t)
    );

    helical(0, 50, 500, 5).draw(ctx, { strokeStyle: "blue" });

    //绘制星形线
    const star = parametric(
      (t, l) => l * Math.cos(t) ** 3,
      (t, l) => l * Math.sin(t) ** 3
    );

    star(0, Math.PI * 2, 50, 150).draw(ctx, { strokeStyle: "red" });
  },

  methods: {},
};
</script>
<style lang='less' scoped>
</style>