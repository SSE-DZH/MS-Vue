<template>
  <div>
    <!-- 添加容器限制按钮位置 -->
    <div class="button-container">
      <!-- 数据导出按钮 -->
      <el-button type="primary" class="export-btn" @click="exportData">导出数据</el-button>
    </div>

    <!-- 下拉框选择课程 -->
    <el-select v-model="selectedCourse" placeholder="请选择课程" @change="getCourseScores">
      <el-option v-for="course in courses" :key="course" :label="course" :value="course">
      </el-option>
    </el-select>

    <!-- 报表统计图表容器 -->
    <div v-if="selectedCourse !== null">
      <!-- 添加图表初始化条件 -->
      <div v-if="chart" ref="chartContainer" style="width: 800px; height: 600px;"></div>
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
      chart: null, // ECharts 实例
      courseScores: {} // 存放课程成绩分布数据
    };
  },
  mounted() {
    // 获取课程列表
    this.getCourses();
  },
  methods: {
    // 获取课程列表
    getCourses() {
      // 发送请求获取课程列表
      // 请求地址为 /course/findAllCname
      this.$axios.get('http://localhost:10086/course/findAllCname')
        .then(response => {
          this.courses = response.data;
          // 初始化图表
          this.initChart();
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
    },
    // 初始化图表
    initChart() {
      // 确保图表容器存在
      if (!this.$refs.chartContainer) {
        console.error("图表容器不存在");
        return;
      }

      this.chart = echarts.init(this.$refs.chartContainer);
      // 初始化图表配置项
      const option = {
        xAxis: {
          data: ['<60', '60-69', '70-79', '80-89', '90-100']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [1, 2, 3, 4, 5],
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
      if (!this.selectedCourse) {
        console.error('请选择课程');
        return;
      }
      const term = '24-春季学期'; // 这里设置学期，你可以根据实际情况修改
      // 发送请求获取课程成绩分布数据
      // 注意修改请求地址和参数传递方式
      this.$axios.post(`http://localhost:10086/SCT/findByCname/${this.selectedCourse}/${term}`)
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
              scores.lessThan60,
              scores.sixtyTo69,
              scores.seventyTo79,
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
      // 发送请求导出数据
      // 此处示例请求地址为 /{cid}/download，具体根据后端实际情况修改
      this.$axios.get(`http://localhost:10086/${this.selectedCourse}/download`)
        .then(response => {
          // 下载文件
          // 示例代码，具体根据后端返回的数据处理
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
