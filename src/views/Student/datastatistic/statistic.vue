<template>
  <div>
    <!-- 添加容器限制按钮位置 -->
    <div class="button-container">
      <!-- 数据导出按钮 -->
      <el-button type="primary" class="export-btn" @click="exportData">导出数据</el-button>
    </div>

    <!-- 下拉框选择学期 -->
    <el-select v-model="selectedTerm" placeholder="请选择学期" @change="getCourseScores">
      <el-option v-for="term in terms" :key="term" :label="term" :value="term"></el-option>
    </el-select>

    <!-- 报表统计图表容器 -->
    <div>
      <!-- 添加图表初始化条件 -->
      <div id="main" style="width: 800px; height: 600px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      selectedTerm: null, // 选择的学期
      chart: null, // ECharts 实例
      courseScores: [], // 存放课程成绩数据
      terms: [], // 存放所有学期列表
    };
  },
  mounted() {
    this.findAllTerm();
    this.initChart();
  },
  methods: {
    async findAllTerm() {
      try {
        const response = await this.$axios.get('http://localhost:10086/SCT/findAllTerm');
        this.terms = response.data;
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    },
    getCourseScores() {
      if (!this.selectedTerm) {
        console.error('请选择学期');
        return;
      }
      // 清零先前选择学期的数据
      this.courseScores = {};
      const sid = sessionStorage.getItem('sid');
      this.$axios.get(`http://localhost:10086/SCT/findBySid/${sid}/${this.selectedTerm}`)
        .then(response => {
          this.courseScores = response.data;
          this.updateChart();
        })
        .catch(error => {
          console.error('Error fetching course scores:', error);
        });
    },
    updateChart() {
      if (!this.chart) {
        console.error('图表未初始化');
        return;
      }
      const data = this.courseScores.map(course => ({
        value: course.grade,
        name: `${course.tname}: ${course.cname}: ${course.grade}`, // 修改这里，显示cname和grade
      }));
      const option = {
        series: [
          {
            type: 'pie',
            data: data,
            label: { // 添加label配置
              show: true,
              formatter: '{b}', // {b}表示name，{c}表示value
            },
            roseType: 'area'
          }
        ]
      };
      this.chart.setOption(option);
    },
    exportData() {
      if (!this.selectedTerm) {
        console.error('请选择学期');
        this.$message({
          showClose: true,
          message: '请选择学期',
          type: 'error'
        });
        return;
      }
      // 发送请求导出数据
      // 根据实际情况修改请求地址和参数传递方式
      this.$axios.get(`http://localhost:10086/SCT/exportStudent/${sessionStorage.getItem("sid")}/${this.selectedTerm}`, { responseType: 'blob' })
        .then(response => {
          // 创建blob对象
          const blob = new Blob([response.data]);
          // 创建a标签
          const downloadLink = document.createElement('a');
          // 设置a标签的href为blob对象的URL
          downloadLink.href = window.URL.createObjectURL(blob);
          // 设置文件下载的名称，包含学生姓名、选择的学期和“成绩报表”字样
          downloadLink.download = `${sessionStorage.getItem("name")}-${this.selectedTerm}-成绩报表.xlsx`;
          // 将a标签点击事件触发下载
          downloadLink.click();
        })
        .catch(error => {
          console.error('Error exporting data:', error);
        });
    },
    initChart() {
      const chartContainer = document.getElementById('main');
      if (!chartContainer) {
        console.error('Chart container not found');
        return;
      }
      this.chart = echarts.init(chartContainer);
      const option = {
        series: [
          {
            type: 'pie',
            data: [],
            roseType: 'area'
          }
        ]
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style>
.export-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

/* 新增样式，限制按钮位置 */
.button-container {
  position: relative;
  margin-bottom: 20px;
  /* 添加间距，避免与图表容器重叠 */
}
</style>
