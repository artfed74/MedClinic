<!-- components/PatientGrowthChart.vue -->
<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { ref, onMounted } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const baseUrl = 'http://api-medical';
const growthData = ref([]);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Прирост пациентов',
      data: [],
      fill: false,
      borderColor: '#4f46e5',
      tension: 0.3
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    }
  }
};

const fetchGrowth = async () => {
  const res = await fetch(`${baseUrl}/api/statistics/patients`);
  const data = await res.json();
  growthData.value = data.growth_by_month;

  chartData.value.labels = growthData.value.map(item => item.month);
  chartData.value.datasets[0].data = growthData.value.map(item => item.count);
};

onMounted(() => {
  fetchGrowth();
});
</script>

<template>
  <div style="height: 400px">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
