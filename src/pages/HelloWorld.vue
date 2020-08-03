<template>
  <div class="hello">
    <canvas width="512" height="512" class="canvas"></canvas>
  </div>
</template>

<script>
export default {
  mounted() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    const rectSize = [100, 100];
    // 暂存状态
    context.save();
    //平移
    context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);
    context.fillStyle = "red";
    context.beginPath();
    context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize);
    context.fill();
    //反平移
    context.translate(0.5 * rectSize[0], 0.5 * rectSize[1]);
    context.restore(); // 恢复状态
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas {
  background-color: antiquewhite;
}
</style>
