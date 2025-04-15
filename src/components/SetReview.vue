<script setup>
import { ref } from 'vue';
import router from '@/router/index.js';
import StarRating from 'vue-star-rating'; // Импортируем библиотеку

const review_text = ref('');
const review_datetime = ref('');
const estimation = ref(0); // Инициализируем рейтинг как число
const token = localStorage.getItem('token');
const patient_id = localStorage.getItem('patient_id');
const errorText = ref('');
const errorEstimation = ref('');
const apihost = 'http://api-medical/api';

// Функция для получения текущей даты в нужном формате
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Формат 'ГГГГ-ММ-ДД'
};

const setReview = async () => {
  review_datetime.value = getCurrentDate(); // Устанавливаем дату

  // Сброс ошибок перед каждой попыткой регистрации
  errorText.value = '';
  errorEstimation.value = '';

  const responses = await fetch(apihost + '/reviews/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      review_datetime: review_datetime.value,
      patient_id: patient_id,
      review_text: review_text.value,
      estimation: estimation.value,
    }),
  });

  const dataFetch = await responses.json();
  console.log(dataFetch);

  if (!dataFetch.success) {
    await router.push('/');
    if (dataFetch.errors) {
      errorText.value = dataFetch.errors.review_text || '';
      errorEstimation.value = dataFetch.errors.estimation || '';
      console.log(dataFetch.errors);
    }
  }
};
</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center">Оставить отзыв</h1>
      <form class="registration card" @submit.prevent="setReview" style="margin: 0 auto">
        <label>Комментарий</label>
        <textarea placeholder="Ваш комментарий" v-model="review_text"
                  :class="errorText ? 'error-input' : ''"></textarea>
        <div v-if="errorText">
          <span class="error-span">{{ errorText }}</span>
        </div>
        <label>Ваша оценка</label>
        <!-- Звездный рейтинг с использованием vue-star-rating -->
        <star-rating v-model:rating="estimation" :star-size="30" :show-rating="false"></star-rating>

        <div v-if="errorEstimation">
          <span class="error-span">{{ errorEstimation }}</span>
        </div>
        <button class="base-button">Отправить</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "../assets/login.css";
</style>
