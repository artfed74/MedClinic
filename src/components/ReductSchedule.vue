<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const scheduleId = route.params.id;
const doctorId = ref(null);
console.log(scheduleId)
const token = localStorage.getItem('token');
const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const schedules = ref([]);
const submitted = ref(false);

// Функция загрузки расписания
const loadSchedule = async () => {
  try {
    const response = await fetch(`http://api-medical/api/schedule/${scheduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Ошибка загрузки расписания');
    }
    const data = await response.json();
    schedules.value = data.data.schedule; // Загружаем расписание из API
    doctorId.value = data.data.doctor_id;
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

const addSchedule = () => {
  const nextDayIndex = schedules.value.length;
  // Убедитесь, что добавление происходит только до Friday
  if (nextDayIndex < dayOfWeek.length) {
    schedules.value.push({
      day_of_week: dayOfWeek[nextDayIndex],
      start_time: '',
      end_time: ''
    });
  } else {
    alert('Все дни недели уже добавлены!');
  }
};

const removeSchedule = (index) => {
  schedules.value.splice(index, 1);
};

const submitForm = async () => {
  const payload = {
    doctor_id: doctorId.value, // Используем .value для получения числа
    schedule: schedules.value,
  };

  try {
    const response = await fetch(`http://api-medical/api/schedule/${scheduleId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Ошибка обновления расписания');
    }

    const data = await response.json();
    console.log('Успех:', data);
    submitted.value = true;
    window.location = `/doctors/${doctorId.value}`; // И тут используем .value
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось обновить расписание');
  }
};

// Загружаем расписание при монтировании компонента
onMounted(loadSchedule);
</script>

<template>
  <div>
    <h2>Редактировать расписание врача</h2>
    <form @submit.prevent="submitForm" class="registration card" style="margin: 0 auto;margin-bottom: 40px">
      <div v-for="(schedule, index) in schedules" :key="index" class="schedule-item">
        <label>
          День недели:
          <input v-model="schedule.day_of_week" required disabled />
        </label>
        <label>
          Время начала:
          <input type="time" v-model="schedule.start_time" required />
        </label>
        <label>
          Время окончания:
          <input type="time" v-model="schedule.end_time" required />
        </label>
        <button @click.prevent="removeSchedule(index)">Удалить</button>
      </div>
      <button @click.prevent="addSchedule" class="base-button">Добавить день</button>
      <button type="submit" class="base-button">Сохранить расписание</button>
    </form>
    <div v-if="submitted">
      <h3>Расписание обновлено:</h3>
      <pre>{{ JSON.stringify({ doctor_id: doctorId, schedule: schedules }, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/createschedule.css";

.schedule-item {
  margin-bottom: 10px;
}
</style>
