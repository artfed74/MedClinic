<script setup>
import { ref } from 'vue';
import router from '@/router';

const email = ref('');
const password = ref('');
const firstname = ref('');
const lastname = ref('');
const patronymic = ref('');
const date_birth = ref('');
const gender = ref('');

const errorEmail = ref('');
const errorPassword = ref('');
const errorFirstname = ref('');
const errorDate = ref('');
const errorGender = ref('');
const errorLastname = ref('');
const errorPatronymic = ref('');

const status = ref(null);
const apihost = 'http://api-medical/api';

const signUp = async () => {
  const responses = await fetch(apihost + '/users/store', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
      patronymic: patronymic.value,
      gender: gender.value,
      date_birth: date_birth.value,
    }),
  });

  const dataFetch = await responses.json();
  status.value = dataFetch.success;
  console.log(dataFetch);

  // Сбрасываем ошибки перед каждой попыткой регистрации
  errorEmail.value = '';
  errorFirstname.value = '';
  errorLastname.value = '';
  errorPassword.value = '';
  errorPatronymic.value = '';
  errorGender.value = '';
  errorDate.value = '';

  if (!responses.ok) {

    errorEmail.value = dataFetch.errors?.email?.join(' ') || '';
    errorFirstname.value = dataFetch.errors?.firstname?.join(' ') || '';
    errorLastname.value = dataFetch.errors?.lastname?.join(' ') || '';
    errorPassword.value = dataFetch.errors?.password?.join(' ') || '';
    errorPatronymic.value = dataFetch.errors?.patronymic?.join(' ') || '';
    errorGender.value = dataFetch.errors?.gender?.join(' ') || '';
    errorDate.value = dataFetch.errors?.date_birth?.join(' ') || '';

    console.log(dataFetch.errors);
  } else {
    // Переход на страницу логина только если регистрация успешна
    window.location.href = '/login';
  }
};

</script>

<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center">Регистрация</h1>
      <form class="registration card" @submit.prevent="signUp" style="margin: 0 auto;margin-bottom: 40px">
        <label>Фамилия
          <input v-model="lastname" type="text" :class="errorLastname ? 'error-input' : ''">
        </label>
        <div v-if="errorLastname">
          <span class="error-span">{{ errorLastname }}</span>
        </div>
        <label>Имя
          <input v-model="firstname" type="text" :class="errorFirstname ? 'error-input' : ''">
        </label>
        <div v-if="errorFirstname">
          <span class="error-span">{{ errorFirstname }}</span>
        </div>
        <label>Отчество
          <input v-model="patronymic" type="text">
        </label>
        <label>E-mail
          <input v-model="email" type="email" :class="errorEmail ? 'error-input' : ''">
        </label>
        <div v-if="errorEmail">
          <span class="error-span">{{ errorEmail }}</span>
        </div>
        <label>Пароль
          <input v-model="password" type="password" :class="errorPassword ? 'error-input' : ''">
        </label>
        <div v-if="errorPassword">
          <span class="error-span">{{ errorPassword }}</span>
        </div>
        <label>Дата рождения
          <input v-model="date_birth" type="date" :class="errorDate ? 'error-input' : ''">
        </label>
        <div v-if="errorDate">
          <span class="error-span">{{ errorDate }}</span>
        </div>
        <label>Пол
          <select v-model="gender" :class="errorGender ? 'error-input' : ''">
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </label>
        <div v-if="errorGender">
          <span class="error-span">{{ errorGender }}</span>
        </div>
        <button class="base-button">Зарегистрироваться</button>
        <p>Есть аккаунт? <a href="/login" class="reg-btn">Войти</a></p>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import "../assets/registration.css";
</style>
