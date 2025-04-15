<script setup>
import { onMounted, ref } from 'vue'
const spec = ref([]); // Список врачей
const baseUrl='http://api-medical';
const role = localStorage.getItem('role');

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

// Загружаем отзывы при монтировании компонента
onMounted(fetchSpec);
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title"><a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a> / Специалисты</h2>
      <a v-if="role=='Администратор'" class="btn-accent" href="/doctors/create">Добавить специалиста</a>

    </div>
    <div class="personal-cards" style="margin-bottom: 40px">
      <div class="person-card" v-for="doctor in spec" :key="doctor.id">
        <div class="person-card__header">
          <div class="person-card__name"><a :href="`/doctors/${doctor.id}`">{{doctor.lastname}} {{doctor.firstname}} {{doctor.patronymic}}</a></div>
          <div class="author">
            <img class="author__photo author__photo--lg" :src="`${baseUrl}/${doctor.photo}`">
          </div>
        </div>
        <div class="person-card__text">Квалификация: {{doctor.qualification || 'Нет данных'}} <br>Специализация: {{doctor.specialization || 'Нет данных'}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/index.css";

</style>
