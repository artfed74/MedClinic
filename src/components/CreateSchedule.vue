<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();
const doctorId = route.params.id;
const token = localStorage.getItem('token');
const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const schedules = ref([
  { day_of_week: dayOfWeek[0], start_time: '', end_time: '' },
]);
const submitted = ref(false);

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

const submitForm = () => {
  const payload = {
    doctor_id: doctorId,
    schedule: schedules.value,
  };

  fetch(`http://api-medical/api/doctors/${doctorId}/schedule`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      submitted.value = true;
      window.location = `/doctors/${doctorId}`;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
</script>
<template>
  <div>
    <h2>Создать расписание врача</h2>
    <form @submit.prevent="submitForm" class="registration card" style="margin: 0 auto">
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
      <h3>Создано расписание:</h3>
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
