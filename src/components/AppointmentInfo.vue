<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import html2pdf from 'html2pdf.js'; // Импортируем html2pdf
import med from '@/assets/images/med.png';
const route = useRoute();
const appointmentDetails = ref(null);
const appointmentId = route.params.id;
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const patientId=localStorage.getItem('patient_id');
const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  });
};
const fetchAppointmentDetails = async (id) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://api-medical/api/appointments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    const data = await response.json();
    appointmentDetails.value = data.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
};

onMounted(() => {
  fetchAppointmentDetails(appointmentId);
});

const goBack = async (doctor_id) => {
  if(role==='Врач'||role ==='Администратор'){
    window.location = `/doctor/${doctor_id}/appointments`;
  }
  if(role==='Пациент'){
    window.location = `/profile/${patientId}/appointments`;

  }
};

const goPresc = async (appointmentId) => {
  window.location = `/prescriptions/create/${appointmentId}`;
};

// Функция для скачивания назначения в формате PDF
const downloadPrescription = async () => {
  const doc = document.createElement('div');
  const medBase64 = await loadImageAsBase64(med);

  // Создаем содержимое PDF из appointmentDetails
  doc.innerHTML = `
    <img src="${medBase64}" style="width: 120px;height: 80px" />
    <h2>Назначение пациента: ${appointmentDetails.value.patient_full_name}</h2>
    <p><strong>№ Записи:</strong> ${appointmentDetails.value.id}</p>
    <h4>Медицинские данные пациента</h4>
    <p><strong>Серия паспорта:</strong> ${appointmentDetails.value.medical_data.passport_serial}</p>
    <p><strong>Номер паспорта:</strong> ${appointmentDetails.value.medical_data.passport_number}</p>
    <p><strong>Номер полиса:</strong> ${appointmentDetails.value.medical_data.policy_number}</p>
    <p><strong>Тип полиса:</strong> ${appointmentDetails.value.medical_data.policy_type}</p>
    <p><strong>Группа крови:</strong> ${appointmentDetails.value.medical_data.blood_type}</p>
    <p><strong>Диагноз:</strong> ${appointmentDetails.value.medical_data.diagnosis}</p>

    <h4>Информация о приёме</h4>
    <p><strong>Врач:</strong> ${appointmentDetails.value.doctor_full_name}</p>
    <p><strong>Услуга:</strong> ${appointmentDetails.value.service_name}</p>
    <p><strong>Кабинет:</strong> ${appointmentDetails.value.room_name} (номер ${appointmentDetails.value.room_number})</p>
    <p><strong>Время приёма:</strong> ${appointmentDetails.value.appointment_time}</p>
    <p><strong>Статус:</strong> ${appointmentDetails.value.status}</p>

    <h4>Пункт назначений</h4>
    ${appointmentDetails.value.prescriptions.map(p => `
      <div style="margin-bottom: 20px;">
        <p><strong>Назначения:</strong> ${p.medication}</p>
        <p><strong>Комментарии:</strong> ${p.comment}</p>
        <p><strong>Дата назначения:</strong> ${new Date(p.prescription_date).toLocaleString()}</p>
        <p><strong>Врач, выдавший назначение:</strong> ${p.doctor_full_name}</p>
        <p><strong>Подпись:</strong></p>
      </div>
    `).join('')}
  `;

  const opt = {
    margin: 1,
    filename: `prescription_${appointmentDetails.value.id}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf()
    .from(doc)
    .set(opt)
    .save();
};
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title">
        <a href="/" style="text-decoration: none;color: #2C9EAE">Приёмы</a>
        /
        <span>Детали приёма</span>
      </h2>
    </div>

    <div v-if="appointmentDetails" class="person-card" style="margin-bottom: 40px">
      <p><strong>№ Записи: </strong> {{ appointmentDetails.id }}</p>
      <p><strong>Пациент:</strong> {{ appointmentDetails.patient_full_name }}</p>

      <h4>Медицинские данные</h4>
      <p><strong>Серия паспорта:</strong> {{ appointmentDetails.medical_data.passport_serial }}</p>
      <p><strong>Номер паспорта:</strong> {{ appointmentDetails.medical_data.passport_number }}</p>
      <p><strong>Номер полиса:</strong> {{ appointmentDetails.medical_data.policy_number }}</p>
      <p><strong>Тип полиса:</strong> {{ appointmentDetails.medical_data.policy_type }}</p>
      <p><strong>Группа крови:</strong> {{ appointmentDetails.medical_data.blood_type }}</p>
      <p><strong>Диагноз:</strong> {{ appointmentDetails.medical_data.diagnosis }}</p>

      <h4>Информация о враче</h4>
      <p><strong>Врач:</strong> {{ appointmentDetails.doctor_full_name }}</p>
      <p><strong>Услуга:</strong> {{ appointmentDetails.service_name }}</p>
      <p><strong>Кабинет:</strong> {{ appointmentDetails.room_name }} (номер {{ appointmentDetails.room_number }})</p>
      <p><strong>Время приёма:</strong> {{ appointmentDetails.appointment_time }}</p>
      <p><strong>Статус:</strong> {{ appointmentDetails.status }}</p>

      <button v-if="role === 'Врач' && appointmentDetails.status !== 'Отменён' && appointmentDetails.status !== 'Завершён'" class="btn-accent" @click="goPresc(appointmentId)">Выдать назначение</button>
      <button v-if="role === 'Врач' || role === 'Администратор' || role === 'Пациент'" class="btn-accent" style="margin-left: 20px" @click="goBack(appointmentDetails.doctor_id)">Назад</button>

      <button
        v-if="appointmentDetails.status === 'Завершён' && appointmentDetails.prescriptions.length > 0"
        class="btn-accent"
        style="margin-left: 20px"
        @click="downloadPrescription">
        Скачать назначение
      </button>
    </div>

    <div v-else>
      Загрузка данных о приёме...
    </div>
  </div>
</template>

<style scoped>
@import "../assets/appointmentpage.css";
</style>
