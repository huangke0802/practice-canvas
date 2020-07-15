<template>
  <div class="hello">
    <canvas id="myCanvas" width="1600" height="1600"></canvas>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  mounted(){

    const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json';

    const TAU = 2 * Math.PI;

    function draw(ctx, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
      const children = node.children;
      const { x, y, r } = node;
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      if (children) {
        for (let i = 0; i < children.length; i++) {
          draw(ctx, children[i]);
        }
      } else {
        const name = node.data.name;
        ctx.fillStyle = textColor;
        ctx.font = '1.5rem Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, x, y);
      }
    }


    (async function () {
      const data = await (await fetch(dataSource)).json();

      const regions = d3.hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);

      const pack = d3.pack()
        .size([1600, 1600])
        .padding(3);

      const root = pack(regions);

      const canvas = document.querySelector('#myCanvas');
      const context = canvas.getContext('2d');

      draw(context, root);
    }());
  }
};
</script>


<style scoped>

</style>
