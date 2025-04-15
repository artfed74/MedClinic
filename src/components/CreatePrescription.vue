<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const doctorId = localStorage.getItem('doctor_id');
const route = useRoute();
const medication = ref('');
const comment = ref('');
const errorName = ref(null);
const errorComment = ref(null);
const token = localStorage.getItem('token');
const id = route.params.id;

const setService = async () => {
  // Очищаем ошибки перед отправкой
  console.log('Doctor ID:', doctorId); // Проверка значения doctorId

  errorName.value = null;
  errorComment.value = null;

  const response = await fetch(`http://api-medical/api/appointments/${id}/prescriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      medication: medication.value,
      comment: comment.value,
      doctor_id:doctorId
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    // Выводим ошибки в консоли
    console.error('Error response:', data);

    // Проверяем наличие ошибок валидации
    if (data.errors) {
      if (data.errors.medication) {
        errorName.value = data.errors.medication[0]; // Первая ошибка для поля medication
      }
      if (data.errors.comment) {
        errorComment.value = data.errors.comment[0]; // Первая ошибка для поля comment
      }
    } else {
      // Обработка других ошибок
      console.error('Unexpected error:', data);
    }
  } else {
    // Успешно создано назначение
    console.log('Prescription created successfully:', await response.json());
    window.location = `/doctor/${doctorId}/appointments`
  }
};
</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center;font-weight: 300">Выдача назначений пациенту</h1>
      <form class="registration card" @submit.prevent="setService" style="margin: 0 auto;margin-bottom: 40px">
        <label>Назначение</label>
        <textarea v-model="medication" :class="{ 'error-input': errorName }"></textarea>
        <div v-if="errorName">
          <span class="error-span">{{ errorName }}</span>
        </div>

        <label>Комментарии (необязательно)</label>
        <textarea v-model="comment" :class="{ 'error-input': errorComment }"></textarea>
        <div v-if="errorComment">
          <span class="error-span">{{ errorComment }}</span>
        </div>

        <button class="base-button">Отправить</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "../assets/login.css";
.error-input {
  border: 1px solid red; /* Обводим красной рамкой в случае ошибки */
}
</style>
