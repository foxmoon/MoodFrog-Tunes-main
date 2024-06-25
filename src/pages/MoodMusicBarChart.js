import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// 生成昨天到今天每小时的时间标签数组
const generateTimeLabels = () => {
  const labels = [];
  const date = new Date();
  date.setHours(0, 0, 0, 0); // 设置为今天的午夜
  date.setDate(date.getDate() - 1); // 回退到昨天的午夜

  for (let i = 0; i < 48; i++) { // 从昨天开始，每小时一个标签，一共48小时
    labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    date.setHours(date.getHours() + 1); // 增加一个小时
  }

  return labels;
};

const MoodMusicBarChart = () => {
  const labels = generateTimeLabels();

  // 假设的心情数据，正数代表好心情，负数代表不好心情
  // 数据应该从后端获取或根据实际需求生成
  const moodData = Array.from({ length: 48 }, () => 
    Math.random() * 20 - 10 // 随机生成心情数据，正负波动
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: '心情统计',
        data: moodData,
        backgroundColor: moodData.map((value) =>
          value > 0 ? 'rgba(255, 159, 64, 0.2)' : 'rgba(54, 162, 235, 0.2)'
        ),
        borderColor: moodData.map((value) =>
          value > 0 ? 'rgba(255, 159, 64, 1)' : 'rgba(54, 162, 235, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'AI心情音乐管理',
        font: {
          size: 24
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toFixed(0),
        },
      },
      x: {
        title: {
          display: true,
          text: '时间',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default MoodMusicBarChart;