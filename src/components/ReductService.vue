<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const name = ref('');
const price = ref('');

const doctorId = ref(route.query.doctor_id || null); // Извлекаем doctor_id из строки запроса

const id = route.params.id; // ID услуги из маршрута
const token = localStorage.getItem('token');

const errorName = ref('');
const errorPrice = ref('');
const apihost = 'http://api-medical/api';

// Функция для получения данных услуги
const fetchService = async () => {
  try {
    const response = await fetch(`${apihost}/services/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    console.log('Данные услуги:', data);

    // Если запрос успешный, заполняем поля
    if (data && data.data) {
      name.value = data.data.name || '';
      price.value = data.data.price || '';
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных услуги:', error);
  }
};
const updateService = async () => {
  errorName.value = '';
  errorPrice.value = '';

  const responses = await fetch(apihost + `/services/update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name.value,
      price: price.value,
    }),
  });

  const dataFetch = await responses.json();
  console.log(dataFetch);

  if (!dataFetch.success) {
    await router.push(`/doctors/${doctorId.value}\``);
    if (dataFetch.errors) {
      errorName.value = dataFetch.errors.name || '';
      errorPrice.value = dataFetch.errors.price || '';
      console.log(dataFetch.errors);
    }
  }
};

// Загружаем данные услуги при монтировании
onMounted(() => {
  fetchService();
});
</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center;font-weight: 300">Редактирование услуги врача</h1>
      <form class="registration card" @submit.prevent="updateService" style="margin: 0 auto">
        <label>Название услуги</label>
        <input placeholder="Имя" v-model="name"
               :class="errorText ? 'error-input' : ''">
        <div v-if="errorName">
          <span class="error-span">{{ errorName }}</span>
        </div>
        <label>Цена</label>
        <input type="number" placeholder="Цена" v-model="price" :class="errorPrice ? 'error-input' : ''">

        <div v-if="errorPrice">
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
