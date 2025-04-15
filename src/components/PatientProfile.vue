<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const appointments = ref([]); // Для хранения записей

const route = useRoute();
const patient = ref(null);
const isEditing = ref(false);
const isEditingMed = ref(false);
const formData = ref({});
const baseUrl = 'http://api-medical';
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

onMounted(async () => {
  const id = route.params.id;
  await fetchPatient(id);
  await fetchAppointments(id); // Fetch appointments on mount

});
const logout = async () => {
  if (confirm("Вы уверены, что хотите выйти?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('patient_id');
    localStorage.removeItem('role');
    await fetch("http://api/api-medical/users/logout", { method: "POST" });
    await router.push('/');  // Добавьте await перед router.push
  }
};
const redirectToAddMedcard = () => {
  const id = route.params.id;
  router.push(`/patients/${id}/medcard/create`);
};
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
const fetchAppointments = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/appointments/patient/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    if (data && data.data) {
      appointments.value = data.data; // Сохраните записи в appointments
    }
  } catch (error) {
    console.error('Не удалось загрузить записи:', error);
  }
};
const fetchPatient = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/patients/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    console.log(data);

    if (data && data.data) {
      patient.value = data.data;
      patient.value.medcard = data.data.medcard || null;
      formData.value = {
        firstname: data.data.firstname,
        lastname: data.data.lastname,
        patronymic: data.data.patronymic,
        date_birth: data.data.date_birth,
        passport_serial: data.data.passport_serial,
        passport_number: data.data.passport_number,
        policy_number: data.data.policy_number,
        policy_type: data.data.policy_type === 'ОМС' ? 'omc' : 'dmc',
        gender: data.data.gender,
        blood_type: data.data.medcard ? mapBloodType(data.data.medcard.blood_type) : '',
        diagnosis: data.data.medcard ? data.data.medcard.diagnosis : '',
        chronic_conditions: data.data.medcard ? data.data.medcard.chronic_conditions : '',
        notes: data.data.medcard ? data.data.medcard.notes : ''
      };
    }
  } catch (error) {
    console.error('Не удалось загрузить данные:', error);
  }
};
const mapBloodType = (bloodType) => {
  switch (bloodType) {
    case 'Первая':
      return 'first';
    case 'Вторая':
      return 'second';
    case 'Третья':
      return 'third';
    case 'Четвёртая':
      return 'fourth';
    default:
      return '';
  }
};

const saveChanges = async () => {
  const id = route.params.id;
  console.log("Данные для сохранения:", formData.value); // Логируем отправляемые данные
  try {
    const response = await fetch(`${baseUrl}/api/patients/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Получаем данные ошибки
      console.error('Ошибка при сохранении:', errorData); // Выводим ошибку
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Успешно обновлено:', data);
    isEditing.value = false;
    await fetchPatient(id);
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
};
const saveChangesMed = async () => {
  const id = route.params.id;
  const medcardId = patient.value.medcard ? patient.value.medcard.id : null;

  try {
    const response = await fetch(`${baseUrl}/api/medcards/update/${medcardId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blood_type: formData.value.blood_type,
        chronic_conditions: formData.value.chronic_conditions,
        diagnosis: formData.value.diagnosis,
        notes: formData.value.notes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Получаем данные ошибки
      console.error('Ошибка при сохранении:', errorData); // Выводим ошибку
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Успешно обновлено:', data);
    isEditingMed.value = false;
    await fetchPatient(id);
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
};
const goApps = async () => {
  const id = route.params.id
  window.location = `/profile/${id}/appointments`
}
const goNot = async () => {
  const id = route.params.id
  window.location = `/profile/${id}/notifications`
}
const cancelEdit = () => {
  isEditing.value = false;
  // Сбрасываем данные формы
  formData.value = {
    firstname: patient.value.firstname,
    lastname: patient.value.lastname,
    patronymic: patient.value.patronymic,
    date_birth: patient.value.date_birth,
    passport_serial: patient.value.passport_serial,
    passport_number: patient.value.passport_number,
    policy_number: patient.value.policy_number,
    policy_type: patient.value.policy_type,
    gender: patient.value.gender,
  };
};
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title">
        <a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a>
        /
        <span>Профиль пациента</span>
      </h2>
    </div>
    <button class="tabs button">Общая информация</button><button  class="tabs2" @click="goApps()">Записи на прием</button><button  class="tabs2" @click="goNot()">Уведомления</button>
    <div class="person-card" style="margin-top: 15px">
      <div class="person-card__header">
        <div class="author">
          <img class="author__photo author__photo--lg" src="../assets/images/medical.svg">
        </div>
      </div>
      <div class="person-card__text" v-if="patient">
        <template v-if="isEditing">
          <label>Фамилия</label><input v-model="formData.lastname" placeholder="Фамилия" />
          <label>Имя</label><input v-model="formData.firstname" placeholder="Имя" />
          <label>Отчество</label><input v-model="formData.patronymic" placeholder="Отчество" />
          <label>Дата рождения</label><input v-model="formData.date_birth" type="date" placeholder="Дата рождения" />
          <label>Серия паспорта</label><input v-model="formData.passport_serial" placeholder="Серия паспорта" />
          <label>Номер паспорта</label> <input v-model="formData.passport_number" placeholder="Номер паспорта" />
          <label>Номер полиса</label><input v-model="formData.policy_number" placeholder="Номер полиса" />
          <label>Тип полиса</label><select id="policy_type" v-model="formData.policy_type">
          <option value="omc">ОМС</option>
          <option value="dmc">ДМС</option>
        </select>
          <button @click="saveChanges" class="btn-accent">Сохранить</button>
          <button @click="cancelEdit" class="btn-secondary">Отмена</button>
        </template>
        <template v-else>
          <h2 class="reviews-title">{{ patient.lastname }} {{ patient.firstname }} {{ patient.patronymic }}</h2>
          <h3 class="reviews-title-h3">Дата рождения: {{ formatDate(patient.date_birth) }}</h3>
          <h3 class="reviews-title-h3">Пол: {{ patient.gender }}</h3>
          <h3 class="reviews-title-h3">Серия паспорта: {{ patient.passport_serial }}</h3>
          <h3 class="reviews-title-h3">Номер паспорта: {{ patient.passport_number }}</h3>
          <h3 class="reviews-title-h3">Номер полиса: {{ patient.policy_number }}</h3>
          <h3 class="reviews-title-h3">Тип полиса: {{ patient.policy_type }}</h3>
          <button @click="isEditing = true" class="btn-accent">Редактировать профиль</button><button class="btn-accent" style="margin-left: 20px" @click="logout">Выйти из системы</button>
        </template>
      </div>
    </div>
    <div class="title-inner">

      <h2 class="reviews-title">
        Медицинские данные
      </h2>
      <button v-if="role === 'Пациент' && patient && !patient.medcard" class="btn-accent" @click="redirectToAddMedcard">Добавить данные</button>
      <button v-if="role === 'Пациент' && patient && patient.medcard" class="btn-accent" @click="isEditingMed=true">Редактировать</button>

    </div>
      <div v-if="patient && patient.medcard && !isEditingMed" class="patient-card" style="margin-bottom: 40px">
        <h3 class="reviews-title-h3">Группа крови: {{ patient.medcard.blood_type }}</h3>
        <h3 class="reviews-title-h3">Диагнозы: {{ patient.medcard.diagnosis || 'Отсутствуют' }}</h3>
        <h3 class="reviews-title-h3">Хронические заболевания: {{ patient.medcard.chronic_conditions || 'Отсутствуют' }}</h3>
        <h3 class="reviews-title-h3">Заметки: {{ patient.medcard.notes || 'Отсутствуют' }}</h3>
      </div>
    <div v-else>
      <p v-if="!isEditingMed">Медицинские данные отсутствуют.</p>
    </div>
    <template v-if="isEditingMed">
      <label>Группа крови</label>
      <select id="blood_type" v-model="formData.blood_type">
        <option value="first">Первая</option>
        <option value="second">Вторая</option>
        <option value="third">Третья</option>
        <option value="fourth">Четвёртая</option>
      </select>
      <label>Диагнозы</label><textarea v-model="formData.diagnosis" placeholder="Диагнозы" />
      <label>Хронические заболевания</label><textarea v-model="formData.chronic_conditions" placeholder="Хронические заболевания" />
      <label>Заметки</label><textarea v-model="formData.notes" placeholder="Заметки" />
      <button @click="saveChangesMed" class="btn-accent">Сохранить</button>
      <button @click="isEditingMed=false" class="btn-secondary" style="margin-bottom: 40px">Отмена</button>
    </template>

  </div>

</template>


<style scoped>
@import "../assets/profile-patient.css";
</style>
