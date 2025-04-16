<template>
  <form class="registration card" style="margin: 0 auto;margin-top: 60px; margin-bottom: 20px">
    <h1>Запись на прием к врачу</h1>

    <div>
      <label for="serviceName">Услуга:</label>
      <p id="serviceName">{{ service.name }}</p>
    </div>

    <div>
      <label for="servicePrice">Цена:</label>
      <p id="servicePrice">{{ service.price }} руб.</p>
    </div>

    <div>
      <label for="doctorName">Врач:</label>
      <p id="doctorName">{{ service.doctor_full }}</p>
    </div>

    <div>
      <label for="appointmentDate">Выберите дату:</label>
      <Flatpickr
        v-model="appointmentDate"
        :config="{
    locale: Russian,
    dateFormat: 'd-m-Y',
    minDate: 'today',
    enable: enabledDates
  }"
        class="custom-date-input"
      />
    </div>

    <div v-if="appointmentDate && availableTimes.length">
      <label for="appointmentTime">Выберите свободное время:</label>
      <select v-model="selectedTime" required>
        <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>

    <button @click="submitAppointment" class="base-button">Записаться</button>
  </form>

  <div v-if="errorMessages.length" class="error-message" style="margin-bottom: 20px">
    <ul>
      <p v-for="(error, index) in errorMessages" :key="index" style="color: red;margin-right: 20px">{{ error }}</p>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.min.css'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
const enabledDates = ref([]);
const convertDateToYMD = (dateStr) => {
  const [day, month, year] = dateStr.split('-')
  return `${year}-${month}-${day}`
}
const config = {
  locale: Russian,
  dateFormat: "d-m-Y",
  minDate: 'today',
  enable: enabledDates.value

}
const service = ref({});
const appointmentDate = ref('');
const selectedTime = ref('');
const errorMessages = ref([]);
const availabilityError = ref('');

const serviceId = window.location.pathname.split("/").pop();
const patientId = localStorage.getItem('patient_id');
const token = localStorage.getItem('token');

const availableTimes = ref([]);
watch(appointmentDate, async (newDate) => {
  if (newDate) {
    await fetchAvailableTimes(newDate);
  }
});
const datepickerKey = ref(0);

const fetchAvailableDates = async () => {
  try {
    const response = await fetch(`http://api-medical/api/available-dates?service_id=${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Ошибка при получении доступных дат');
    const data = await response.json();

    console.log("🟢 Даты с сервера:", data.available_dates); // <-- тут глянем

    enabledDates.value = data.available_dates.map(date => new Date(date));
    config.enable = enabledDates.value;
    console.log("🔵 Передаем в flatpickr:", config.enable); // <-- и тут
    console.log("🟢 Сырые даты:", data.available_dates);
    console.log("🔵 Конвертированные:", enabledDates.value);
    // Перезапуск компонента (если нужно)
    datepickerKey.value++;
  } catch (error) {
    console.error(error);
  }
};
const fetchAvailableTimes = async (date) => {
  watch(appointmentDate, async (newDate) => {
    if (newDate) {
      const formattedDate = convertDateToYMD(newDate);
      await fetchAvailableTimes(formattedDate);
    }
  });
  availableTimes.value = [];
  availabilityError.value = '';

  try {
    const response = await fetch(`http://api-medical/api/available-times?service_id=${serviceId}&date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();
    availableTimes.value = data.available_times;

    if (availableTimes.value.length === 0) {
      availabilityError.value = 'Нет доступного времени на выбранную дату.';
    }
  } catch (error) {
    availabilityError.value = 'Ошибка при получении доступного времени.';
    console.error(error);
  }
};
// Функция для генерации доступных временных слотов
const generateTimeRange = () => {
  for (let hour = 8; hour <= 20; hour++) {
    availableTimes.value.push(`${String(hour).padStart(2, '0')}:00`);
    availableTimes.value.push(`${String(hour).padStart(2, '0')}:30`);
  }
};

const fetchServiceDetails = async () => {
  try {
    const response = await fetch(`http://api-medical/api/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Ошибка при получении информации об услуге');
    }
    const data = await response.json();
    service.value = data.data;

    generateTimeRange(); // Генерируем доступные временные слоты
  } catch (error) {
    console.error(error);
    errorMessages.value.push(error.message);
  }
};

const submitAppointment = async (event) => {
  event.preventDefault();
  errorMessages.value = [];
  availabilityError.value = '';

  const formattedDate = convertDateToYMD(appointmentDate.value);
  const appointmentDateTime = `${formattedDate}T${selectedTime.value}`;

  try {
    const response = await fetch('http://api-medical/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        patient_id: patientId,
        service_id: serviceId,
        appointment_time: appointmentDateTime,
      }),
    });

    if (response.ok) {
      alert('Запись успешно создана!');
      window.location = `/profile/${patientId}`;
    } else {
      const textResponse = await response.text();
      try {
        const errorData = JSON.parse(textResponse);
        errorMessages.value.push(errorData.error || 'Неизвестная ошибка');
      } catch (e) {
        errorMessages.value.push('Произошла ошибка на сервере: ' + textResponse);
      }
    }
  } catch (error) {
    console.error('Ошибка при записи на прием:', error);
    errorMessages.value.push('Ошибка при записи на прием');
  }
};

onMounted(() => {
  fetchServiceDetails();
  fetchAvailableDates();
});</script>

<style scoped>
@import "../assets/login.css";

.appointment-form {
  max-width: 500px;
  margin: auto;
}
h1 {
  text-align: center;
}
label {
  display: block;
  margin-top: 10px;
}
p {
  margin: 5px 0 15px 0;
}
span {
  color: red;
}

input[type="date"],
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #2C9EAE;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

input[type="date"]:focus,
select:focus {
  border-color: #035a6b;
  outline: none;
  box-shadow: 0 0 5px rgba(44, 158, 174, 0.5);
}
.custom-date-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #2C9EAE;
  border-radius: 6px;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.custom-date-input:focus {
  outline: none;
  border-color: #035a6b;
  box-shadow: 0 0 6px rgba(44, 158, 174, 0.4);
}

/* Стилизация самого календаря flatpickr */
:deep(.flatpickr-calendar) {
  font-family: inherit;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Цвет кружочка выбранной даты */
:deep(.flatpickr-day.selected),
:deep(.flatpickr-day.startRange),
:deep(.flatpickr-day.endRange),
:deep(.flatpickr-day:hover),
:deep(.flatpickr-day.today) {
  background: red;
  border-color: #035a6b;
  color: white;
}

/* Цвет выделенной рамки при наведении */
:deep(.flatpickr-day:hover) {
  border-color: #035a6b;
}
</style>
<style>
/* глобальные стили только для Flatpickr */
.flatpickr-day.selected,
.flatpickr-day:hover {
  background-color: #2C9EAE !important;
  color: white;
}
</style>
