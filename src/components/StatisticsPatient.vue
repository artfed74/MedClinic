<script setup>
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

import dayjs from 'dayjs';
import stats from '@/assets/images/bar-chart.png'
import doctorImg from '@/assets/images/doctor.png'
import patient from '@/assets/images/patient.png'
import logout from '@/assets/images/logout.png'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const baseUrl = 'http://api-medical';
const chartData = ref({
  labels: [],
  datasets: [
    {label: 'Пациенты',
      data: [],
      backgroundColor: '#9cc1c9',
      borderColor: '#9cc1c9',
      borderWidth: 2,
      pointRadius: 5,
      tension: 1
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 1, // шаг по оси Y
        precision: 0, // убирает десятичные
        beginAtZero: true, // начинает с нуля
      }
    }
  }
};

const fillMissingMonths = (data, start, end) => {
  const map = Object.fromEntries(data.map(item => [item.month, item.count]));
  const filled = [];

  let current = dayjs(start);
  const last = dayjs(end);

  while (current.isBefore(last) || current.isSame(last)) {
    const monthStr = current.format('YYYY-MM');
    filled.push({
      month: monthStr,
      count: map[monthStr] || 0,
    });
    current = current.add(1, 'month');
  }

  return filled;
};

const patientStats = ref(null);
const period = ref('all');

const fetchPatientStats = async () => {
  const res = await fetch(`${baseUrl}/api/statistics/patients`);
  const data = await res.json();
  console.log('✅ Patient stats response:', data);

  patientStats.value = data;

  let raw = data.growth_by_month || [];
  const months = raw.map(i => i.month);
  const first = months.length ? months[0] : dayjs().format('YYYY-MM');
  const last = dayjs().format('YYYY-MM');

  const filled = fillMissingMonths(raw, first, last);

  chartData.value.labels = filled.map(item => item.month);
  chartData.value.datasets[0].data = filled.map(item => item.count);
};
console.log('🎯 chartData', chartData.value);

onMounted(() => {
  fetchPatientStats();
});
</script>

<template>
  <div class="stats-page">
    <aside class="sidebar">
      <h2 class="menu-title">Статистика</h2>
      <ul class="menu-list">
        <li>
          <router-link to="/statistics" class="menu-item">
            <img :src="stats" alt="Кнопка 1" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/statistics/doctors" class="menu-item">
            <img :src="doctorImg" alt="Кнопка 2" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/statistics/patients" class="menu-item">
            <img :src="patient" alt="Кнопка 3" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/" class="menu-item">
            <img :src="logout" alt="Кнопка 3" style="width: 60px;height: 60px" />
          </router-link>
        </li>
      </ul>
    </aside>
    <main class="content">
      <h1 style="font-weight: 300">Статистика пациентов клиники</h1>

      <div class="select-wrapper">
        <label for="period-select" style="margin-right: 10px; font-size: 18px;">Период:</label>
        <select id="period-select" v-model="period" class="period-select">
          <option value="all">За всё время</option>
          <option value="month">За текущий месяц</option>
        </select>
      </div>
      <div>
        <h2 style="margin-top: 40px; font-weight: 400">График прироста пациентов</h2>
        <div style="max-width: 1000px; height: 550px;">
          <Line
            v-if="chartData.labels.length && chartData.datasets[0].data.length"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
      <h2 style="margin-top: 40px; font-weight: 400">Статистика пациентов клиники</h2>
      <div class="cards-container" style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 30px;">
        <div class="person-card animated-card" style="width: 300px;" v-if="patientStats">
          <div class="person-card__header">
            <div class="person-card__name">Всего пациентов</div>
          </div>
          <div class="person-card__text">
            <div>{{ patientStats.total }}</div>
          </div>
        </div>

        <div class="person-card animated-card" style="width: 300px;" v-if="patientStats">
          <div class="person-card__header">
            <div class="person-card__name">Новых за месяц</div>
          </div>
          <div class="person-card__text">
            <div>{{ patientStats.new_this_month }}</div>
          </div>
        </div>

        <div class="person-card animated-card" style="width: 300px;" v-if="patientStats">
          <div class="person-card__header">
            <div class="person-card__name">Повторные пациенты</div>
          </div>
          <div class="person-card__text">
            <div>{{ patientStats.repeated_percent }}%</div>
          </div>
        </div>

        <div class="person-card animated-card" style="width: 300px;" v-if="patientStats">
          <div class="person-card__header">
            <div class="person-card__name">Среднее кол-во приёмов</div>
          </div>
          <div class="person-card__text">
            <div>{{ patientStats.avg_appointments }}</div>
          </div>
        </div>

        <div class="person-card animated-card" style="width: 300px;" v-if="patientStats && patientStats.popular_service">
          <div class="person-card__header">
            <div class="person-card__name">Популярная услуга</div>
          </div>
          <div class="person-card__text">
            <div>{{ patientStats.popular_service.name }}</div>
            <div>Стоимость: {{ patientStats.popular_service.price }}₽</div>
          </div>
        </div>
      </div>
    </main>
  </div>

</template>
<style scoped>
@import "../assets/index.css";
@import "../assets/stats.css";
</style>
