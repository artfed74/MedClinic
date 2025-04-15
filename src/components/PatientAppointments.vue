<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute();
import router from '@/router/index.js';

const token = localStorage.getItem('token');
const appointments = ref([]);
const openedAppointment = ref(null); // Для хранения состояния открытого аккордеона

const baseUrl = 'http://api-medical';
onMounted(async () => {
  const id = route.params.id;
  await fetchAppointments(id);
});

const fetchAppointments = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/appointments/patient/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    if (data && data.data) {
      appointments.value = data.data; // Сохраните записи в appointments
    }
  } catch (error) {
    console.error('Не удалось загрузить записи:', error);
  }
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false }; // 24-часовой формат

  const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);
  const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

  return `${formattedDate} ${formattedTime}`;
};

const toggleAppointment = (appointment) => {
  openedAppointment.value = openedAppointment.value === appointment ? null : appointment; // Скрыть или открыть
};

const goApps = async () => {
  const id = route.params.id;
  window.location = `/profile/${id}`;
};
const goNot = async () => {
  const id = route.params.id;
  window.location = `/profile/${id}/notifications`;
};
const statuses = ['Все', 'В ожидании', 'В процессе', 'Завершён', 'Отменён'];
const selectedStatus = ref('Все'); // Статус по умолчанию - "Все"

const filteredAppointments = computed(() => {
  if (selectedStatus.value === 'Все') {
    return appointments.value;
  }
  return appointments.value.filter(appointment => appointment.status === selectedStatus.value);
});
const goAppInfo = async (appointmentId) => {
  window.location = `/appointments/${appointmentId}`;
};

</script>


<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title">
        <a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a>
        /
        <span>Профиль пациента</span>
      </h2>
    </div>
    <button class="tabs2" @click="goApps()">Общая информация</button>
    <button class="tabs" @click="goApps()">Записи на прием</button>
    <button class="tabs2" @click="goNot()">Уведомления</button>
    <h2 class="reviews-title">Записи</h2>
    <div class="status-filter">
      <label for="statusSelect" style="font-size: 20px;">Фильтр по статусу:</label>
      <select id="statusSelect" v-model="selectedStatus" class="filter">
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>
    <div v-if="filteredAppointments.length > 0">
      <ul>
        <li v-for="appointment in filteredAppointments" :key="appointment.id" class="appointment-item">
          <div class="appointment-header" @click="toggleAppointment(appointment)">
            <h3 class="appointment-title" :style="{ color: '#259BABFF' }">
              Прием № {{ appointment.id }}
            </h3>
            <button @click.stop="goAppInfo(appointment.id)" class="btn-start">
              Подробнее
            </button>
          </div>
          <div class="appointment-details" :class="{ 'open': openedAppointment === appointment }">
            <p>Доктор: {{ appointment.doctor_full_name }}</p>
            <p>Услуга: {{ appointment.service_name }}</p>
            <p>Кабинет: {{ appointment.room_name }} (номер {{ appointment.room_number }})</p>
            <p>Время: {{ formatDateTime(appointment.appointment_time) }}</p>
            <p>Статус: {{ appointment.status }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Записей не найдено.</p>
    </div>
  </div>
</template>


<style scoped>
@import "../assets/profile-patient.css";
ul li{
  list-style-type: none;
}
.spec {
  padding: 20px;
}

.appointment-item {
  border: 1px solid #9cc1c9;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: all 0.3s ease; /* Плавный переход */
}

.appointment-header {
  cursor: pointer; /* Указатель при наведении */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.appointment-title {
  font-size: 1.5em; /* Увеличенный шрифт */
  margin: 0;
}

.appointment-details {
  max-height: 0; /* Начальная высота */
  margin-top: 10px;
  overflow: hidden; /* Скрываем переполнение */
  transition: max-height 0.3s ease, opacity 0.3s ease; /* Плавный переход */
  opacity: 0; /* Начальная непрозрачность для скрытия */
}

.appointment-details.open {
  max-height: 200px; /* Установите максимальную высоту, подходящую для вашего контента */
  opacity: 1; /* Увеличиваем непрозрачность при открытии */
}
.status-filter {
  margin-bottom: 15px;
}
.status-filter label {
  margin-right: 10px;
}
.filter{
  width: 30%;
  margin-top: 10px;
  font-size: 20px;
}
</style>

