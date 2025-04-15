<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const errorBlood = ref('');
const route = useRoute();
const router = useRouter();
const blood_type = ref('');
const diagnosis = ref('');
const patient_id = route.params.id;
const chronic_conditions = ref('');
const notes = ref('');
const baseUrl = 'http://api-medical/api';
const token = localStorage.getItem('token');

const submitMedcard = async () => {
  try {
    const responses = await fetch(baseUrl + '/medcards/store', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        blood_type: blood_type.value,
        diagnosis: diagnosis.value,
        chronic_conditions: chronic_conditions.value,
        notes: notes.value,
        patient_id: patient_id,
      }),
    });

    // Проверка, что ответ имеет тип JSON
    const contentType = responses.headers.get('Content-Type');
    let dataFetch;

    if (contentType && contentType.includes('application/json')) {
      dataFetch = await responses.json();
    } else {
      const errorText = await responses.text(); // В случае ошибки получаем текст ответа
      console.error('Ошибка на сервере:', errorText);
      throw new Error('Сервер вернул неожиданный формат данных');
    }

    console.log(dataFetch);

    // Очистка ошибок
    errorBlood.value = '';

    if (!responses.ok) {
      errorBlood.value = dataFetch.errors?.blood_type?.join(' ') || '';
      console.log(dataFetch.errors);
    } else {
      // Если данные успешно добавлены
      window.location.href = `/profile/${patient_id}`;
    }
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
  }
};
</script>
<template>
  <main class="main">
    <div class="responsive-wrapper">
      <h1 style="text-align: center;font-weight: 300">Добавление медицинских данных</h1>
      <form class="registration card" @submit.prevent="submitMedcard" style="margin: 0 auto;margin-bottom: 40px">
        <label>Группа крови:</label>
        <select v-model="blood_type" :class="errorBlood ? 'error-input' : ''">
          <option value="first">Первая</option>
          <option value="second">Вторая</option>
          <option value="third">Третья</option>
          <option value="fourth">Четвертая</option>
        </select>
        <div v-if="errorBlood">
          <span class="error-span">{{ errorBlood }}</span>
        </div>
        <label>Диагнозы:</label>
        <textarea v-model="diagnosis" placeholder="При наличии" />
        <label>Хронические заболевания:</label>
        <textarea v-model="chronic_conditions" placeholder="При наличии" />
        <label>Заметки:</label>
        <textarea v-model="notes" placeholder="При наличии" />
        <button class="base-button">Добавить данные</button>
      </form>
    </div>

  </main>
</template>

<style scoped>
@import "../assets/MedcardForm.css";
</style>
