<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
const route = useRoute();


const name = ref('');
const price = ref('');
const doctor_id = ref('');
const id = route.params.id;
console.log(id)

const token = localStorage.getItem('token');
const errorName = ref('');
const errorPrice = ref('');
const apihost = 'http://api-medical/api';



const setService = async () => {
  // Сброс ошибок перед каждой попыткой регистрации
  errorName.value = '';
  errorPrice.value = '';

  const responses = await fetch(apihost + '/services/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: name.value,
      price: price.value,
      doctor_id: id,
    }),
  });

  const dataFetch = await responses.json();
  console.log(dataFetch);

  if (!dataFetch.success) {
    await router.push(`/doctors/${id}`);
    if (dataFetch.errors) {
      errorName.value = dataFetch.errors.name || '';
      errorPrice.value = dataFetch.errors.price || '';
      console.log(dataFetch.errors);
    }
  }
};

</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center;font-weight: 300">Добавление врачу услуги</h1>
      <form class="registration card" @submit.prevent="setService" style="margin: 0 auto;margin-bottom: 40px">
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
