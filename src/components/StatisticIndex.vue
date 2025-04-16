<script setup>
import { ref, onMounted, watch } from 'vue';
import stats from '@/assets/images/bar-chart.png';
import doctor from '@/assets/images/doctor.png';
import patient from '@/assets/images/patient.png';
import logout from '@/assets/images/logout.png';

const statsData = ref({});
const period = ref('all'); // 'all' | 'month'

const fetchStats = async () => {
  let url = 'http://api-medical/api/statistics/general';
  if (period.value === 'month') {
    url += '?period=month';
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    statsData.value = data;
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
  }
};

onMounted(fetchStats);
watch(period, fetchStats);
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
            <img :src="doctor" alt="Кнопка 2" style="width: 60px;height: 60px" />
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
      <h1 style="font-weight: 300">Общая статистика клиники</h1>
      <div class="select-wrapper">
        <label for="period-select" style="margin-right: 10px; font-size: 18px;">Период:</label>
        <select id="period-select" v-model="period" class="period-select">
          <option value="all">За всё время</option>
          <option value="month">За текущий месяц</option>
        </select>
      </div>
      <div class="personal-cards" style="margin-bottom: 40px">
        <div class="person-card-2 animated-card">
          <div class="person-card-2__head">
            <div class="author">
              <div><strong class="text">Проведено приёмов</strong></div>
            </div>
          </div>
          <div class="person-card-2__text">{{ statsData.total_completed_appointments }}</div>
        </div>

        <div class="person-card-2 animated-card">
          <div class="person-card-2__head">
            <div class="author">
              <div><strong class="text">Выручка</strong></div>
            </div>
          </div>
          <div class="person-card-2__text">{{ statsData.total_revenue  }}₽</div>
        </div>

        <div class="person-card-2 animated-card">
          <div class="person-card-2__head">
            <div class="author">
              <div><strong class="text">Средний чек</strong></div>
            </div>
          </div>
          <div class="person-card-2__text">{{ statsData.average_appointment_price  }}₽</div>
        </div>

        <div class="person-card-2 animated-card">
          <div class="person-card-2__head">
            <div class="author">
              <div><strong class="text">Всего пациентов</strong></div>
            </div>
          </div>
          <div class="person-card-2__text">{{ statsData.total_patients }}</div>
        </div>

        <div class="person-card-2 animated-card">
          <div class="person-card-2__head">
            <div class="author">
              <div><strong class="text">Всего врачей</strong></div>
            </div>
          </div>
          <div class="person-card-2__text">{{ statsData.total_doctors  }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import "../assets/stats.css";
</style>
