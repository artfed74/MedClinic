<script setup>

import { ref } from 'vue';

import {  onMounted } from 'vue';
import close from '@/assets/images/close.png'
import StarRating from 'vue-star-rating'; // Импортируем библиотеку

// Состояния
const reviews = ref([]); // Список отзывов
const isModalOpen = ref(false); // Состояние модального окна
const currentReview = ref(null); // Текущий выбранный отзыв
const token =localStorage.getItem('token');
const role =localStorage.getItem('role');
const patient_id =localStorage.getItem('patient_id');
// Функция для открытия модального окна
const openModal = (review) => {
  currentReview.value = review;
  isModalOpen.value = true;
};

// Функция для закрытия модального окна
const closeModal = () => {
  isModalOpen.value = false;
  currentReview.value = null;
};

// Функция загрузки отзывов из API
const fetchReviews = async () => {
  try {
    const response = await fetch('http://api-medical/api/reviews');

    const text = await response.text();  // Читаем текстовый ответ

    // Проверка на успешный ответ
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = JSON.parse(text); // Парсим ответ как JSON
    console.log(data); // Логируем данные для отладки

    // Просто присваиваем массив из data.data
    if (data && Array.isArray(data.data)) {
      reviews.value = data.data;
    } else {
      console.error('Не удалось получить список отзывов');
    }

  } catch (error) {
    console.error('Не удалось загрузить отзывы:', error);
  }
};
const deleteReview =async (id) => {
  if(confirm("Вы уверены,что хотите удалить отзыв?")){
    try {
      const response = await fetch(`http://api-medical/api/reviews/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${token}`,

        },
      });

      if (response.ok) {
        console.log('Успешное удаление');
        await fetchReviews();


      } else {
        const errorText = await response.text();
        console.error(`Ошибка при удалении отзыва: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Сетевая ошибка:', error);
      alert('Произошла сетевая ошибка при удалении отзыва.');
    }
  }
}
const formatDate = (dateString) => {
  const date = new Date(dateString); // Преобразуем строку в объект Date
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',  // Полный год (например, "2024")
    month: 'long',     // Полное название месяца (например, "ноябрь")
    day: 'numeric',    // День месяца (например, "14")
  });
};
// Загружаем отзывы при монтировании компонента
onMounted(fetchReviews);
</script>
<template>
  <div class="reviews">
    <div class="title-inner">
      <h2 class="reviews-title"><a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a> / Отзывы о клинике</h2>
      <a v-if="token && role=='Пациент'" class="btn-accent" href="/reviews/create">Оставить отзыв</a>

    </div>
    <div class="personal-cards" style="margin-bottom: 40px">
      <div class="person-card-2" v-for="review in reviews" :key="review.id">
        <div class="person-card-2__head">
          <div class="author">
            <div>
              <div>Автор: {{ review.patient }}</div>
            </div>
          </div>
        </div>

        <div class="person-card-2__text">{{ review.text }}</div>
        <button class="person-card-2__btn" @click="openModal(review)">Читать полностью</button>
        <button class="person-card-2__btn"  style="bottom: 5px;" v-if="role=='Администратор'" @click="deleteReview(review.id)" >Удалить</button>
      </div>
    </div>
  </div>
  <div :class="['modal', { 'modal--visible': isModalOpen }]" v-show="true">
    <div class="modal__content modal__content--width-2">
      <button class="modal__close" @click="closeModal">
        <img :src="close" alt="Закрыть">
      </button>
      <div class="review">
        <div class="review__head">
          <div class="author">
            <div>
              <div class="author__action">{{ currentReview?.patient }}</div>
            </div>
          </div>
        </div>
        <div class="review__text">{{ currentReview?.text }}</div>
        <div class="review__footer">
          <div class="review__author">
            <!-- Звёздный рейтинг для отображения оценки, только для чтения -->
            <star-rating :rating="currentReview?.estimation" :star-size="30" :show-rating="false" :read-only="true"></star-rating>
          </div>
          <div class="review__date">{{ formatDate(currentReview?.review_datetime) }}</div>
        </div>
      </div>
    </div>
  </div>



</template>

<style scoped>
@import "../assets/index.css";
</style>
