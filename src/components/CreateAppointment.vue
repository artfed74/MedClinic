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
      <input
        type="date"
        v-model="appointmentDate"
        required
      />
    </div>

    <div v-if="availableTimes.length">
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
const fetchAvailableTimes = async (date) => {
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

  // Комбинируем дату и время
  const appointmentDateTime = `${appointmentDate.value}T${selectedTime.value}`;

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

onMounted(fetchServiceDetails);
</script>

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
</style>
