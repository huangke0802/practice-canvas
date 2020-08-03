<template>
  <div class="hello">
    <el-form :inline="true" :model="formInline" class="form_wrap" size="small">
      <el-form-item label="多边形边数">
        <el-input-number v-model="formInline.sidesNum" :step="1" :min="2"></el-input-number>
      </el-form-item>
      <el-form-item label="圆的半径">
        <el-input-number v-model="formInline.radius" :step="0.1" :min="0.5" :max="2"></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="图形颜色">
        <el-input type="color" v-model="formInline.color"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成</el-button>
      </el-form-item>
    </el-form>

    <canvas width="512" height="512" class="canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        sidesNum: 3,
        radius: 1,
        color: "#333333"
      }
    };
  },
  mounted() {
    const vertex = this.createVertex();

    const fragment = this.createFragment();

    const points = this.separateCircle(3, 1);

    this.drawPicture(vertex, fragment, points);
  },
  methods: {
    //生成着色器 vertex
    createVertex() {
      return `
      attribute vec2 position;
      varying vec3 color;

      void main() {
        gl_PointSize = 1.0;
        color = vec3(0.5 + position * 0.5, 0.0);
        gl_Position = vec4(position * 0.5, 1.0, 1.0);
      }
    `;
    },
    //生成着色器 fragment
    createFragment(rgb = [25, 25, 1]) {
      return `
        precision mediump float;
        varying vec3 color;

        void main()
        {
          gl_FragColor = vec4(color, 1.0);
        }    
      `;
    },
    //生成多边形：将数据存入缓存，再传给GPU；
    drawPicture(vertex, fragment, points) {
      const canvas = document.querySelector("canvas");
      const gl = canvas.getContext("webgl");
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertex);
      gl.compileShader(vertexShader);

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragment);
      gl.compileShader(fragmentShader);

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      gl.useProgram(program);

      const bufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

      const vPosition = gl.getAttribLocation(program, "position");
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
    },
    //根据多边形的边数分隔一个圆来生成一个正多边形，n正多边形的边数，大于或等于3，r为圆的半径
    separateCircle(n, r) {
      if (!n || n < 3) return;

      const PI = Math.PI;
      const sin = Math.sin;
      const cos = Math.cos;

      let points = [];

      for (let i = 0; i < n; i++) {
        const angle = (2 * PI * i) / n;
        const x = r * cos(angle);
        const y = r * sin(angle);
        points.push(x);
        points.push(y);
      }

      return new Float32Array(points);
    },
    //点击生成按钮
    onSubmit() {
      const { formInline = {} } = this;
      const { sidesNum, radius, color } = formInline;

      const vertex = this.createVertex();
      const hex = this.hexToRgba(color);
      console.log(hex);
      const fragment = this.createFragment(hex);

      const points = this.separateCircle(sidesNum, radius);

      this.drawPicture(vertex, fragment, points);
    },
    //将16进制颜色转成rgba
    hexToRgba(hex) {
      if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
      }
      const r = parseInt("0x" + hex.slice(1, 3));
      const g = parseInt("0x" + hex.slice(3, 5));
      const b = parseInt("0x" + hex.slice(5, 7));

      return [r, g, b];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form_wrap {
  padding: 12px 8px;
}
</style>
