<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router/index.js';

const room_number = ref('');
const room_name = ref('');
const doctor_id = ref('');
const type = ref('');
const doctors = ref([]); // Массив для врачей
const token = localStorage.getItem('token');
const errorNumber = ref('');
const errorName = ref('');
const errorDoctor = ref('');
const apihost = 'http://api-medical/api';

const fetchDoctors = async () => {
  try {
    const response = await fetch(`${apihost}/doctors`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      doctors.value = data.data; // Сохраняем список врачей
    } else {
      console.error('Ошибка загрузки врачей:', data.message);
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
  }
};

const setRoom = async () => {
  errorName.value = '';
  errorNumber.value = '';
  errorDoctor.value = '';

  const responses = await fetch(`${apihost}/rooms/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      room_number: room_number.value,
      room_name: room_name.value,
      doctor_id: doctor_id.value,
      type: type.value,
    }),
  });

  const dataFetch = await responses.json();
  console.log(dataFetch);

  if (!dataFetch.success) {
    await router.push('/rooms');
    if (dataFetch.errors) {
      errorName.value = dataFetch.errors.room_name || '';
      errorNumber.value = dataFetch.errors.room_number || '';
      errorDoctor.value = dataFetch.errors.doctor_id || '';
      console.log(dataFetch.errors);
    }
  }
};

// Загружаем список врачей при монтировании компонента
onMounted(fetchDoctors);
</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center">Добавление кабинета</h1>
      <form class="registration card" @submit.prevent="setRoom" style="margin: 0 auto">
        <label>Номер кабинета
          <input v-model="room_number" type="text" :class="errorNumber ? 'error-input' : ''">
        </label>
        <div v-if="errorNumber">
          <span class="error-span">{{ errorNumber }}</span>
        </div>
        <label>Наименование кабинета
          <input v-model="room_name" type="text" :class="errorName ? 'error-input' : ''">
        </label>
        <div v-if="errorName">
          <span class="error-span">{{ errorName }}</span>
        </div>
        <label>Принимающий врач</label>
        <select v-model="doctor_id" :class="errorDoctor ? 'error-input' : ''">
          <option disabled selected>Выберите врача</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.lastname }} {{ doctor.firstname }} {{ doctor.patronymic }}
          </option>
        </select>
        <label>Тип кабинета</label>
        <select v-model="type" :class="errorDoctor ? 'error-input' : ''">
          <option disabled selected>Выберите тип</option>
          <option>
            Процедурный
          </option>
          <option>
            Приёмный
          </option>
        </select>
        <div v-if="errorDoctor">
          <span class="error-span">{{ errorDoctor }}</span>
        </div>
        <button class="base-button">Отправить</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "../assets/login.css";
</style>
