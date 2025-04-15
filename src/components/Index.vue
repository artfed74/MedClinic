<script setup>
import like from '@/assets/images/like.svg';
import two from '@/assets/images/2.svg';
import three from '@/assets/images/3.svg';
import four from '@/assets/images/4.svg';
import five from '@/assets/images/5.svg';
import banner from '@/assets/images/banner.png';
import telephone from '@/assets/images/telephone.png';
import gps from '@/assets/images/gps.png';
import close from '@/assets/images/close.png';
import admin_foto from '@/assets/images/admin.png';
import emblem from '@/assets/images/emblem.png';
import vk from '@/assets/images/vk.svg';
import tg from '@/assets/images/telegram (1).png';

import { ref } from 'vue';

import {  onMounted } from 'vue';
const baseUrl='http://api-medical';
// Состояния
const reviews = ref([]); // Список отзывов
const spec = ref([]); // Список врачей
const isModalOpen = ref(false); // Состояние модального окна
const currentReview = ref(null); // Текущий выбранный отзыв

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
// Функция загрузки отзывов из API
const fetchSpec = async () => {
  try {
    const response = await fetch('http://api-medical/api/doctors');

    const text = await response.text();  // Читаем текстовый ответ

    // Проверка на успешный ответ
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = JSON.parse(text); // Парсим ответ как JSON
    console.log(data); // Логируем данные для отладки

    // Просто присваиваем массив из data.data
    if (data && Array.isArray(data.data)) {
      spec.value = data.data;
    } else {
      console.error('Не удалось получить список отзывов');
    }

  } catch (error) {
    console.error('Не удалось загрузить отзывы:', error);
  }
};
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
onMounted(fetchSpec);
</script>

<template>
<main>
  <div class="about">
    <h2 class="about-h3">Наши преимущества</h2>
    <div class="advantage">
      <div class="advantage_item">
        <div class="advantage_item-image"><img :src="like" loading="lazy" width="100" height="100" alt="иконка Доступные цены"></div>
        <div class="advantage_item-text">Доступные цены</div>
      </div>
      <div class="advantage_item">
        <div class="advantage_item-image"><img :src="two" loading="lazy" width="100" height="100" alt="иконка Доступные цены"></div>
        <div class="advantage_item-text">Новейшее оборудование</div>
      </div>
      <div class="advantage_item">
        <div class="advantage_item-image"><img :src="three" loading="lazy" width="100" height="100" alt="иконка Доступные цены"></div>
        <div class="advantage_item-text">Эффективные обследования</div>
      </div>
      <div class="advantage_item">
        <div class="advantage_item-image"><img :src="four" loading="lazy" width="100" height="100" alt="иконка Доступные цены"></div>
        <div class="advantage_item-text">Лучшее восстановление</div>
      </div>
      <div class="advantage_item">
        <div class="advantage_item-image"><img :src="five" loading="lazy" width="100" height="100" alt="иконка Доступные цены"></div>
        <div class="advantage_item-text">Быстрое избавление от болезней</div>
      </div>
    </div>
  </div>
  <div class="container">
  <div class="capture-0_inner">
    <div class="left">
      <h2 class="capture-0__title">Медицинский центр <br> в 5 минутах от дома</h2>
      <p class="capture-0__text">Наш медицинский центр находится в удобном месте рядом с центром города на пересечении улицы Маркса и Завенягина</p>
      <div class="capture-0__button">
      </div>
    </div>
    <div class="right">
      <img class="capture-0__bg" :src="banner" loading="lazy" alt="banner-image" width="431" height="331">
    </div>
  </div>
  </div>
  <div class="contacts" style="margin-top: 80px">
    <h2 class="section-title">Как нас найти</h2>
    <div class="row">
      <div class="col-6 contacts__info">
        <div class="contacts__card">
          <div class="foot45">
            <div class="contacts__card-ic">
              <img :src="gps" alt="GPS Icon" style="width: 33px; height: 33px;">
            </div>
            <div class="contacts__card-address" style="font-size: 20px">г. Магнитогорск, ул. Карла Маркса, 170</div>
          </div>
          <div class="foot45">
            <div class="contacts__card-ic">
              <img :src="telephone" alt="Phone Icon" style="width: 33px; height: 33px;">
            </div>
            <div class="contacts__card-address">
              <a class="contacts__card-phone" href="tel:+73433753209" style="font-size: 20px;color: black;text-decoration: none;margin-left: 0px">+7 (343) 375-32-09</a>
            </div>
          </div>
          <div class="contacts__card-row">
            <div class="contacts__card-worktime">
              <div>
                <p>Пн-пт</p>
                <p>08:00-20:00</p>
              </div>
              <div>
                <p>Сб</p>
                <p>09:00-15:00</p>
              </div>
              <div>
                <p>Вс</p>
                <p>выходной</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 contacts__map">
        <div class="contacts-page__map" id="mymap">
          <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad9b604012dc0cfe9b34eeb869a9e93bbc37f53ab388b1583942e8c1b04103853&amp;source=constructor" width="500" height="400" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </div>
  <div class="spec" style="margin-top: 80px;">
    <div class="title-inner">
      <h2 class="reviews-title">Специалисты</h2>
      <a class="btn-accent" href="/doctors">Все специалисты</a>
    </div>
    <div class="personal-cards">
      <div class="person-card" v-for="doctor in spec.slice(0, 6)" :key="doctor.id">
        <div class="person-card__header">
<!--         // Добавить вывод айди врача в апишке-->
          <div class="person-card__name"><a :href="`/doctors/${doctor.id}`">{{doctor.lastname}} {{doctor.firstname}} {{doctor.patronymic}}</a>
          </div>
          <div class="author">
            <img class="author__photo author__photo--lg" :src="`${baseUrl}/${doctor.photo}`">
          </div>
        </div>
        <div class="person-card__text">Квалификация: {{doctor.qualification || 'Нет данных'}} <br>Специализация: {{doctor.specialization || 'Нет данных'}}
        </div>
      </div>
    </div>
  </div>
  <section class="capture-2" style="margin-top: 80px">
    <div class="container capture-2__container">
      <h2 class="capture-2__title">Волнуетесь за безопасность <br> своих данных?</h2>
      <p class="capture-2__text">Администратор клиники следит за их защитой и обеспечивает конфиденциальность вашей информации</p>

      <img class="capture-2__bg"  :src="admin_foto" loading="lazy" alt="banner-photo">
    </div>
  </section>
  <div class="reviews" style="margin-top: 80px">
    <div class="title-inner">
      <h2 class="reviews-title">Отзывы о клинике</h2>
      <a class="btn-accent" href="/reviews">Все отзывы</a>
    </div>
    <div class="personal-cards" style="margin-bottom: 40px">
      <div class="person-card-2" v-for="review in reviews.slice(0, 6)" :key="review.id">
        <div class="person-card-2__head">
          <div class="author">
            <div>
              <div>Автор: {{ review.patient }}</div>
            </div>
          </div>
        </div>

        <div class="person-card-2__text">{{ review.text }}</div>
        <button class="person-card-2__btn" @click="openModal(review)">Читать полностью</button>
      </div>
    </div>
  </div>

  <!-- Модальное окно -->
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
          <div class="review__author">Оценка: {{currentReview?.estimation}}</div>
          <div class="review__date">{{ formatDate(currentReview?.review_datetime) }}</div>
        </div>
      </div>
    </div>
  </div>
</main>

</template>

<style scoped>
@import "../assets/index.css";
</style>
