<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const weekDaysTranslation = {
  Monday: 'Понедельник',
  Tuesday: 'Вторник',
  Wednesday: 'Среда',
  Thursday: 'Четверг',
  Friday: 'Пятница',
  Saturday: 'Суббота',
  Sunday: 'Воскресенье'
};

const doctor = ref(null);
const spec = ref(null);
const showUploadButton = ref(false);

const qual = ref(null);
const route = useRoute();
const router = useRouter();
const file = ref(null);

const isEditing = ref(false);
const baseUrl = 'http://api-medical';
const doctorId = route.params.id;
const doctorIdFromStorage = localStorage.getItem('doctor_id');

const admin = localStorage.getItem('admin_id');
const formData = ref({
  firstname: '',
  lastname: '',
  patronymic: '',
  experience: '',
  qualification_id: null,
  specialization_id: null,
});

const qualifications = ref([]); // Список всех квалификаций
const specializations = ref([]); // Список всех специализаций

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
console.log(role);

onMounted(async () => {
  const id = route.params.id;
  await fetchDoctor(id);
  await fetchQualifications();
  await fetchSpecializations();
});
const addSchedule = async (id) =>{
  window.location=`/doctors/schedules/create/${id}`;
}
const editSchedule = async (id) =>{
  window.location=`/doctors/schedules/edit/${id}`;
}
const fetchDoctor = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/doctors/${id}`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.data) {
      doctor.value = data.data;

      // Обновляем formData с использованием ID
      formData.value = {
        firstname: data.data.firstname,
        lastname: data.data.lastname,
        patronymic: data.data.patronymic,
        experience: data.data.experience,
        qualification_id: data.data.qualification?.id ?? null, // ID квалификации
        specialization_id: data.data.specialization?.id ?? null // ID специализации
      };
    } else {
      console.error('Не удалось получить данные о враче');
    }
  } catch (error) {
    console.error('Не удалось загрузить данные:', error);
  }
};

const fetchQualifications = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/qualifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    qualifications.value = data.data || []; // Заполняем список квалификаций
    console.log(qualifications.value);
  } catch (error) {
    console.error('Не удалось загрузить данные о квалификациях:', error);
  }
};

const fetchSpecializations = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/specializations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    specializations.value = data.data || []; // Заполняем список специализаций
    console.log(specializations.value);
  } catch (error) {
    console.error('Не удалось загрузить специализации:', error);
  }
};



const experienceText = computed(() => {
  const years = doctor.value?.experience;
  if (years == null) return 'Нет данных';

  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${years} лет`; // Исключение для чисел от 11 до 19
  }

  if (lastDigit === 1) {
    return `${years} год`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${years} года`;
  } else {
    return `${years} лет`;
  }
});

const servicesTitle = computed(() => {
  if (doctorIdFromStorage && doctor.value && parseInt(doctorIdFromStorage) === doctor.value.id) {
    return "Ваши услуги";
  }
  return "Услуги специалиста";
});

const logout = async () => {
  if (confirm("Вы уверены, что хотите выйти?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('patient_id');
    localStorage.removeItem('doctor_id');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('role');
    await fetch("http://api/api-medical/users/logout", { method: "POST" });
    await router.push('/');  // Добавьте await перед router.push
  }
};
const deleteSpec = async (id)=>{
  const IdSpec = route.params.id;
  if(confirm("Вы уверены,что хотите удалить услугу?")){
    try {
      const response = await fetch(`${baseUrl}/api/services/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${token}`,

        },
      });

      if (response.ok) {
        console.log('Успешное удаление');
        await fetchDoctor(IdSpec);


      } else {
        const errorText = await response.text();
        console.error(`Ошибка при удалении услуги: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Сетевая ошибка:', error);
      alert('Произошла сетевая ошибка при удалении услуги.');
    }
  }
}
const cancelEdit = () => {
  isEditing.value = false;
  // Сбрасываем данные формы
  formData.value = {
    firstname: doctor.value.firstname,
    lastname: doctor.value.lastname,
    patronymic: doctor.value.patronymic,
    experience: doctor.value.experience,
    qualification: doctor.value.qualification,
    specialization: doctor.value.specialization
  };
};
const saveChanges = async () => {
  const id = route.params.id;

  try {
    const response = await fetch(`${baseUrl}/api/doctors/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        patronymic: formData.value.patronymic,
        experience: formData.value.experience,
        qualification_id: formData.value.qualification_id,
        specialization_id: formData.value.specialization_id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка при сохранении:', errorData);
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Успешно обновлено:', data);
    isEditing.value = false;
    await fetchDoctor(id);
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
};

function onFileChange(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    showUploadButton.value = true; // Показываем кнопку загрузки
  }
}
async function uploadImage() {
  const id = route.params.id;

  if (!file.value) return;

  const formData = new FormData();
  formData.append('photo', file.value);

  try {
    const response = await fetch(`http://api-medical/api/doctors/${id}/upload-photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error(`Ошибка при загрузке изображения! Статус: ${response.status}`);

    // Скрываем кнопку после успешной загрузки
    showUploadButton.value = false;
    file.value = null;

    // Обновляем данные о враче
    fetchDoctor(id);
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
  }
}
const goApps = async () => {
  const id = route.params.id
  window.location = `/doctor/${id}/appointments`
}
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title">
        <a href="/" style="text-decoration: none;color: #2C9EAE">Главная</a>
        /
        <span v-if="doctor">
            Страница специалиста
        </span>
        <span v-else>Загрузка информации о враче...</span>
      </h2>
    </div>

    <!-- Показываем кнопки, если doctorId совпадает с doctorIdFromStorage -->
    <template v-if="doctorIdFromStorage === doctorId.toString() || role ==='Администратор' ">
      <button class="tabs button">Общая информация</button>
      <button class="tabs2" @click="goApps()">Мои приёмы</button>
    </template>

    <div class="person-card" v-if="doctor" style="margin-top: 10px">
      <div class="person-card__header">
        <div class="author">
          <img class="author__photo author__photo--lg" :src="`${baseUrl}/${doctor.photo}`" />
          <!-- Область с кнопками для загрузки фото -->
          <div class="photo-actions">
            <button v-if="role=='Администратор'" class="btn-accent btn-photo" @click="() => $refs.fileInput.click()" style="margin-left:40px">Обновить фото</button><br>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @change="onFileChange"
              accept="image/*"
            />
            <button style="margin-left:40px"
                    v-if="file"
                    class="btn-accent btn-photo"
                    @click="uploadImage"
            >
              Загрузить
            </button>
          </div>
        </div>
      </div>

      <div class="person-card__text">
        <template v-if="isEditing">
          <!-- Форма редактирования -->
          <label>Фамилия</label><input v-model="formData.lastname" placeholder="Фамилия" />
          <label>Имя</label><input v-model="formData.firstname" placeholder="Имя" />
          <label>Отчество</label><input v-model="formData.patronymic" placeholder="Отчество" />
          <label>Опыт работы</label><input v-model="formData.experience" type="number" placeholder="Опыт работы" />

          <label>Квалификация</label>
          <select v-model="formData.qualification_id">
            <option v-for="qual in qualifications" :key="qual.id" :value="qual.id">
              {{ qual.name }}
            </option>
          </select>

          <label>Специализация</label>
          <select v-model="formData.specialization_id">
            <option v-for="spec in specializations" :key="spec.id" :value="spec.id">
              {{ spec.name }}
            </option>
          </select>
          <button @click="saveChanges" class="btn-accent">Сохранить</button>
          <button @click="cancelEdit" class="btn-accent" style="margin-left: 40px">Отмена</button>
        </template>
        <template v-else>
          <h2 class="reviews-title">{{ doctor.lastname }} {{ doctor.firstname }} {{ doctor.patronymic }}</h2>
          <h3 class="reviews-title-h3">Квалификация: {{ doctor.qualification.name || 'Нет данных' }}</h3>
          <h3 class="reviews-title-h3">Специализация: {{ doctor.specialization.name || 'Нет данных' }}</h3>
          <h3 class="reviews-title-h3">Опыт работы: {{ experienceText || 'Нет данных' }}</h3>
          <div class="schedule-container" style="display: flex; align-items: center; margin-top: 20px;">
            <h3 class="reviews-title-h3" style="margin-right: 20px;">Расписание:</h3>
            <template v-if="doctor.schedule && doctor.schedule.schedule.length > 0">
              <table class="schedule-table">
                <thead>
                <tr>
                  <th>День</th>
                  <th>Приём с</th>
                  <th>Приём до</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="(item, index) in doctor.schedule.schedule" :key="index">
                  <tr>
                    <td>{{ weekDaysTranslation[item.day_of_week] || item.day_of_week }}</td>
                    <td>{{ item.start_time }}</td>
                    <td>{{ item.end_time }}</td>
                  </tr>
                </template>
                </tbody>
              </table>

              <button v-if="role === 'Администратор'"
                      @click="editSchedule(doctor.schedule.id)"
                      class="btn-accent"
                      style="margin-left: 20px;">Редактировать</button>

            </template>
            <template v-else>
              <p>Нет данных о расписании</p>
              <button v-if="role === 'Администратор'"
                      @click="addSchedule(doctorId)"
                      class="btn-accent"
                      style="margin-left: 20px;">Добавить расписание</button>
            </template>
          </div>
          <button @click="isEditing = true" class="btn-accent" v-if="role=='Администратор'">Редактировать профиль</button>
          <button v-if="servicesTitle === 'Ваши услуги'" class="btn-accent" @click="logout">Выйти из системы</button>

        </template>
      </div>
    </div>
    <div v-else>
      Загрузка данных о враче...
    </div>

    <div class="title-inner">
      <h2 class="reviews-title">
        {{ servicesTitle }}
      </h2>
      <a class="btn-accent" :href="`/service/create/${doctorId}`" v-if="role=='Администратор'" style="font-size: 18px">Добавить услугу</a>
    </div>

    <div class="person-card-service" v-if="doctor && doctor.services?.length">
      <div v-for="(service, index) in doctor.services" :key="service.id" class="service-item">
        <div class="service-header">
          <h3 class="reviews-title-name">{{ service.name }}</h3>
          <span class="service-price">{{ service.price }} руб.</span>
        </div>
        <div class="service-link-container">
          <a v-if="role !== 'Врач' && role !== 'Администратор' && token" :href="`/appointments/create/${service.id}`" class="service-link">Записаться на прием</a>
          <a v-if="admin && role == 'Администратор'" :href="`/service/update/${service.id}?doctor_id=${doctorId}`" class="service-link" style="margin-right: 20px;font-size: 18px">Редактировать</a>
          <button v-if="admin && role == 'Администратор'" class="btn-accent" @click="deleteSpec(service.id)">Удалить</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Услуги отсутствуют</p>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/doctorpage.css";

</style>
