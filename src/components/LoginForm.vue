<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center">Авторизация</h1>
      <form class="registration card" @submit.prevent="tryLogin" style="margin: 0 auto">
        <label>E-mail
          <input v-model="email" type="text">
        </label>

        <label>Пароль
          <input v-model="password" type="password">
        </label>
        <button class="base-button">Войти</button>
        <p>Нет аккаунта? <a href="/registration" class="reg-btn">Зарегистрироваться</a> </p>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>

  </main>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false
    }
  },

  methods: {
    async tryLogin() {
      this.loading = true;
      this.errorMessage = "";
      try {
        let response = await fetch("http://api-medical/api/login", {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const login = await response.json();
        console.log('Ответ от сервера:', login);

        if (response.ok) {
          // Сохраняем данные в localStorage
          localStorage.setItem('token', login.data.token);
          localStorage.setItem('role', login.data.role);
          localStorage.setItem('patient_id', login.data.patient_id);
          localStorage.setItem('doctor_id', login.data.doctor_id);
          localStorage.setItem('admin_id', login.data.admin_id);

          // Здесь вызываем обновление состояния
          this.$emit('login'); // Эмитируем событие

          // Переходим на главную страницу
          this.$router.push('/');
        } else {
          this.errorMessage = "Ошибка: " + login.message;
        }
      } catch (error) {
        console.log('Ошибка при входе ', error);
        this.errorMessage = "Неверный логин или пароль";
      } finally {
        this.loading = false;
      }
    },
    mounted() {
      this.token = localStorage.getItem('token') || null;
    }
  }
}
</script>
<style scoped>

@import "../assets/login.css";
</style>
