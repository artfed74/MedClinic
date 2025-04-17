<script setup>
import { ref, onMounted } from 'vue';
import stats from '@/assets/images/bar-chart.png';
import doctorImg from '@/assets/images/doctor.png';
import patient from '@/assets/images/patient.png';
import logout from '@/assets/images/logout.png';
import { watch } from 'vue'
const baseUrl = 'http://api-medical';
const doctors = ref([]);
const doctorsStats = ref({});
const period = ref('all');
const topDoctors = ref([]);

const topDoctorsAll = ref([]);
const topDoctorsMonth = ref([]);

const fetchTopDoctors = async () => {
  const resAll = await fetch(`${baseUrl}/api/statistics/top-doctors`);
  const resMonth = await fetch(`${baseUrl}/api/statistics/top-doctors?period=month`);

  topDoctorsAll.value = await resAll.json();
  topDoctorsMonth.value = await resMonth.json();
};
// Загрузка списка врачей
const fetchDoctors = async () => {
  const res = await fetch(`${baseUrl}/api/doctors`);
  const data = await res.json();
  doctors.value = data.data;
};


const fetchDoctorsStats = async () => {
  const res = await fetch(`${baseUrl}/api/statistics/doctors?period=${period.value}`);
  const data = await res.json();
  doctorsStats.value = data;
};
onMounted(() => {
  fetchDoctors();
  fetchDoctorsStats();
  fetchTopDoctors().then(() => {
    topDoctors.value = period.value === 'all' ? topDoctorsAll.value : topDoctorsMonth.value;
  });
});
watch(period, () => {
  fetchDoctorsStats();

  // Обновляем топ-3 в зависимости от выбранного периода
  if (period.value === 'all') {
    topDoctors.value = topDoctorsAll.value;
  } else {
    topDoctors.value = topDoctorsMonth.value;
  }
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
      <h1 style="font-weight: 300">Статистика врачей клиники</h1>
      <div class="select-wrapper">
        <label for="period-select" style="margin-right: 10px; font-size: 18px;">Период:</label>
        <select id="period-select" v-model="period" class="period-select">
          <option value="all">За всё время</option>
          <option value="month">За текущий месяц</option>
        </select>
      </div>

      <div class="personal-cards" style="margin-bottom: 40px">

        <div class="person-card animated-card" v-for="doctor in doctors" :key="doctor.id">
          <div class="person-card__header">
            <div class="person-card__name">
              <a :href="`/doctors/${doctor.id}`">
                {{ doctor.lastname }} {{ doctor.firstname }} {{ doctor.patronymic }}
              </a>
            </div>
            <div class="author">
              <img class="author__photo author__photo--lg" :src="`${baseUrl}/${doctor.photo}`" />
            </div>
          </div>
          <div class="person-card__text">
            <div>Квалификация: {{ doctor.qualification || 'Нет данных' }}</div>
            <div>Специализация: {{ doctor.specialization || 'Нет данных' }}</div>
            <hr style="margin: 10px 0;">
            <div>Приёмов: {{ doctorsStats[doctor.id]?.total_appointments ?? '—' }}</div>
            <div>Выручка: {{ doctorsStats[doctor.id]?.total_revenue ?? '—' }}₽</div>
            <div>Средний чек: {{ doctorsStats[doctor.id]?.average_price ?? '—' }}₽</div>
          </div>
        </div>
      </div>
      <h2 style="font-weight: 400; margin-top: 40px;">Топ 3 врача по популярности</h2>
      <div class="personal-cards" style="margin-bottom: 40px">
        <div class="person-card" v-for="item in topDoctors" :key="item.doctor_id">
          <div class="person-card__header">
            <div class="person-card__name">
              <a :href="`/doctors/${item.doctor.id}`">
                {{ item.doctor.user.lastname }} {{ item.doctor.user.firstname }} {{ item.doctor.user.patronymic }}
              </a>
            </div>
            <div class="author">
              <img class="author__photo author__photo--lg" :src="`${baseUrl}/${item.doctor.photo}`" />
            </div>
          </div>
          <div class="person-card__text">
            <div>Опыт работы: {{ item.doctor.experience }} лет</div>
            <div>Проведено приёмов: {{ item.appointments_count }}</div>
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
