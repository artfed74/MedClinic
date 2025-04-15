<script setup>
import { onMounted, ref, computed } from 'vue';

const spec = ref([]); // Список кабинетов
const role = localStorage.getItem('role');
const selectedType = ref('Все'); // Переменная для хранения выбранного типа

const fetchSpec = async () => {
  try {
    const response = await fetch('http://api-medical/api/rooms');
    const text = await response.text();  // Читаем текстовый ответ

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = JSON.parse(text); // Парсим ответ как JSON
    console.log(data); // Логируем данные для отладки

    if (data && Array.isArray(data.data)) {
      spec.value = data.data;
    } else {
      console.error('Не удалось получить список кабинетов');
    }
  } catch (error) {
    console.error('Не удалось загрузить кабинеты:', error);
  }
};

// Загружаем кабинеты при монтировании компонента
onMounted(fetchSpec);

// Вычисляем отфильтрованный список кабинетов
const filteredSpecs = computed(() => {
  if (selectedType.value === 'Все') {
    return spec.value;
  }
  return spec.value.filter(room => room.type === selectedType.value); // Замените 'type' на фактическое поле типа кабинета
});
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title"><a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a> / Кабинеты клиники
      </h2>
      <a v-if="role=='Администратор'" class="btn-accent" href="/rooms/create">Добавить кабинет</a>
    </div>

    <div class="filter-container"> <!-- Обернули в контейнер -->
      <label for="roomType" style="font-size: 17px">Тип кабинета:</label>
      <select id="roomType" v-model="selectedType" class="filter">
        <option value="Все">Все</option>
        <option value="Процедурный">Процедурные</option>
        <option value="Приёмный">Приёмные</option>
      </select>
    </div>

    <div class="personal-cards" style="margin-bottom: 40px">
      <div class="person-card" v-for="room in filteredSpecs" :key="room.id">
        <div class="person-card__header">
          <h3 class="person-card__title">Кабинет №{{ room.room_number || 'Не указан' }}</h3>
          <p class="person-card__info">{{ room.room_name || 'Название отсутствует' }}</p>
        </div>

        <div class="person-card__body">
          <p v-if="room.doctor">
            <span class="person-card__name">Приём ведёт </span>
            <p><a :href="`/doctors/${room.doctor.id}`" class="person-card__doctor"
                  style="font-size: 18px">{{ room.doctor.fullname }}</a></p>
          </p>
          <p v-else>
            <span class="person-card__label">Доктор:</span> Не назначен
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/rooms.css";
</style>
