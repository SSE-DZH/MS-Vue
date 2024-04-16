<template>
  <div>
    <!-- 添加容器限制按钮位置 -->
    <div class="button-container">
      <!-- 数据导出按钮 -->
      <el-button type="primary" class="export-btn" @click="exportData">导出数据</el-button>
    </div>

    <!-- 下拉框选择课程 -->
    <el-select v-model="selectedCourse" placeholder="请选择课程" @change="getCourseScores">
      <el-option v-for="course in courses" :key="course" :label="course" :value="course"></el-option>
    </el-select>

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
      courses: [], // 存放课程列表
      selectedCourse: null, // 选择的课程
      selectedTerm: null, // 选择的学期
      chart: null, // ECharts 实例
      courseScores: {}, // 存放课程成绩分布数据
      terms: [], // 存放所有学期列表
    };
  },
  mounted() {
    // 获取课程列表并初始化图表
    this.getCourses();
    // 获取所有学期列表
    this.findAllTerm();
  },
  methods: {
    // 获取课程列表
    async getCourses() {
      try {
        const response = await this.$axios.get('http://localhost:10086/course/findAllCname');
        this.courses = response.data;
        // 在下一次 DOM 更新周期执行初始化
        this.$nextTick(() => {
          this.initChart();
        });
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    // 获取所有学期列表
    async findAllTerm() {
      try {
        const response = await this.$axios.get('http://localhost:10086/SCT/findAllTerm');
        this.terms = response.data;
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    },
    // 初始化图表
    initChart() {
      // 在 DOM 中查找图表容器
      const chartContainer = document.getElementById('main');
      // 如果找不到图表容器，则不执行初始化
      if (!chartContainer) {
        console.error('Chart container not found');
        return;
      }
      // 初始化图表
      this.chart = echarts.init(chartContainer);

      // 初始化图表配置项
      const option = {
        xAxis: {
          data: ['<60', '60-69', '70-79', '80-89', '90-100']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [0, 0, 0, 0, 0],
            itemStyle: {
              barBorderRadius: 5,
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3
            }
          }
        ]
      };
      // 渲染图表
      this.chart.setOption(option);
    },
    // 获取课程成绩分布数据
    getCourseScores() {
      if (!this.selectedCourse || !this.selectedTerm) {
        console.error('请选择课程和学期');
        return;
      }
      // 发送请求获取课程成绩分布数据
      // 注意修改请求地址和参数传递方式
      this.$axios.post(`http://localhost:10086/SCT/findByCname/${this.selectedCourse}/${this.selectedTerm}`)
        .then(response => {
          // 检查返回数据是否为空
          if (!response.data || Object.keys(response.data).length === 0) {
            console.error('返回数据为空或格式不正确');
            return;
          }
          this.courseScores = response.data;
          // Update chart only after course scores data has been fetched
          this.updateChart();
        })
        .catch(error => {
          console.error('Error fetching course scores:', error);
        });
    },
    // 更新图表数据
    updateChart() {
      // 获取课程分数数据
      const scores = this.courseScores.data;
      // 确保图表已经初始化
      if (!this.chart) {
        console.error('图表未初始化');
        return;
      }
      // 更新图表配置项
      const option = {
        series: [
          {
            type: 'bar',
            data: [
              {
                value: scores.lessThan60,
                // 设置单个柱子的样式，此处改为浅红色
                itemStyle: {
                  color: '#FF0000', // 红色
                  shadowColor: '#FF0000',
                  borderType: 'dashed',
                  opacity: 0.5
                }
              },
              // scores.sixtyTo69,
              {
                value: scores.sixtyTo69,
                itemStyle: {
                  color: '#FFC0CB', // 粉色
                  shadowColor: '#FFC0CB',
                  borderType: 'dashed',
                  opacity: 0.5
                }
              },
              {
                value: scores.seventyTo79,
                itemStyle: {
                  color: '#FFFF00', // 黄色
                  shadowColor: '#FFFF00',
                  borderType: 'dashed',
                  opacity: 0.5
                }
              },
              {
                value: scores.eightyTo89,
                // 设置单个柱子的样式
                itemStyle: {
                  color: '#91cc75',
                  shadowColor: '#91cc75',
                  borderType: 'dashed',
                  opacity: 0.5
                }
              },
              scores.ninetyTo100
            ]
          }
        ]
      };
      // 更新图表
      this.chart.setOption(option);
    },

    // 数据导出
    exportData() {
      if (!this.selectedCourse || !this.selectedTerm) {
        console.error('请选择课程和学期');
        this.$message({
          showClose: true,
          message: '请选择课程和学期',
          type: 'error'
        });
        return;
      }
      // 发送请求导出数据
      // 根据实际情况修改请求地址和参数传递方式
      this.$axios.get(`http://localhost:10086/SCT/export/${this.selectedCourse}/${this.selectedTerm}`, { responseType: 'blob' })
        .then(response => {
          // 创建blob对象
          const blob = new Blob([response.data]);
          // 创建a标签
          const downloadLink = document.createElement('a');
          // 设置a标签的href为blob对象的URL
          downloadLink.href = window.URL.createObjectURL(blob);
          // 设置文件下载的名称
          downloadLink.download = `${this.selectedCourse}-${this.selectedTerm}-成绩报表.xlsx`;
          // 将a标签点击事件触发下载
          downloadLink.click();
        })
        .catch(error => {
          console.error('Error exporting data:', error);
        });
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
