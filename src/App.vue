<template>
  <div id="app">
    <header class="header">
      <div class="logo">
        <img :src="med" alt="Логотип" class="logo-img" />
        <RouterLink to="/" class="logo-link">Ваше здоровье</RouterLink>
      </div>
      <nav>
        <ul>
          <li><a v-if="!token" href="/registration">Регистрация</a></li>
          <li><a v-if="!token" href="/login" @click="clearError">Авторизация</a></li>
          <li><a href="/doctors">Врачи</a></li>
          <li><a href="/rooms">Кабинеты клиники</a></li>
          <li><a v-if="token && role === 'Пациент'" :href="`/profile/${patient_id}`">Кабинет пациента</a></li>
          <li><a v-if="token && role === 'Врач'" :href="`/doctors/${doctor_id}`">Кабинет врача</a></li>
          <li v-if="token">
            <button class="logout-button" @click="logout">Выйти</button>
          </li>
        </ul>
      </nav>
      <div class="contact-info">
        <a href="tel:+73433753209" class="phone">+7 (343) 375-32-09</a>
      </div>
    </header>

    <RouterView @login="updateHeader" />
  <footer style="color: #fff;background: #035a6b;">
    <div class="container-footer">
      <div class="footer__bottom-container">
        <div class="footer__bottom-center-column">

        </div>
        <div class="footer__voting">
          <div class="voting">
            <div class="voting__img"><img :src="emblem" loading="lazy" alt="emblem-logo"></div>
            <div class="voting__text">
              <p>Независимая оценка качества оказания услуг медицинскими организациями</p><a style="color: white;" href="https://minzdrav.gov.ru/">Участвовать в голосовании</a>
            </div>
          </div>
        </div>

        <div class="footer__socials">
          <p>Подписывайте на нас<br> в соцсетях</p>
          <ul class="soc288">
            <li style="margin-right: 10px"><a href="https://vk.com/rekreal_clinic" target="_blank" rel="nofollow"><img :src="vk" loading="lazy" alt="logo-vk" width="34" height="34"></a></li>
            <li><a href="https://vk.com/rekreal_clinic" target="_blank" rel="nofollow"><img :src="tg" loading="lazy" alt="logo-vk" width="34" height="34"></a></li>


          </ul>
        </div>
        <div class="footer__copyright">© 2024 Ваше здоровье, все права защищены    </div>
        <div class="footer__zoom"><a  class="footer__zoom-btn" target="_blank" style="text-decoration: none" href="/policy/">
          <span style="color: white;">Политика конфиденциальности   </span></a>
        </div>
      </div>
    </div>
  </footer>
  </div>
</template>

<script setup>
// Импортируйте необходимые функции и компоненты
import { ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import phone from '@/assets/images/telephone.png';
import med from '@/assets/images/med.png';
import router from '@/router/index.js';
import emblem from '@/assets/images/emblem.png'
import vk from '@/assets/images/vk.svg'
import tg from '@/assets/images/telegram (1).png'

const token = ref(localStorage.getItem('token'));
const role = ref(localStorage.getItem('role'));
const patient_id = ref(localStorage.getItem('patient_id'));
const doctor_id = ref(localStorage.getItem('doctor_id'));
const admin_id = ref(localStorage.getItem('admin_id'));

const updateHeader = () => {
  token.value = localStorage.getItem('token');
  role.value = localStorage.getItem('role');
  patient_id.value = localStorage.getItem('patient_id');
  doctor_id.value = localStorage.getItem('doctor_id');
  admin_id.value = localStorage.getItem('admin_id');
};

const logout = async () => {
  if (confirm("Вы уверены, что хотите выйти?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('patient_id');
    localStorage.removeItem('role');
    token.value = null;
    role.value = null;
    patient_id.value = null; // Обнуляем состояние
    doctor_id.value = null;
    admin_id.value = null;
    await fetch("http://api/api-medical/users/logout", { method: "POST" });
    await router.push('/login');
  }
};

// Прочие watch для `localStorage`
watch(
  () => localStorage.getItem('token'),
  (newToken) => {
    token.value = newToken;
    if (newToken) {
      role.value = localStorage.getItem('role');
      patient_id.value = localStorage.getItem('patient_id');
      doctor_id.value = localStorage.getItem('doctor_id');
      admin_id.value = localStorage.getItem('admin_id');
    } else {
      role.value = null;
      patient_id.value = null;
      doctor_id.value = null;
      admin_id.value = null;
    }
  }
);

</script>
<style scoped>
footer {
  margin-top: auto; /* Отодвигает футер вниз */
}
#app {
  display: flex;
  flex-direction: column; /* Устанавливаем направление для Flexbox */
  min-height: 100vh; /* Минимальная высота на всю высоту вьюпорта */
}
</style>
