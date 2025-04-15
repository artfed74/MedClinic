<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import mark from '@/assets/images/mark.png'
import del from '@/assets/images/delete.png'
const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
const notifications = ref([])
const unreadCount = ref(0) // Добавляем реактивную переменную для хранения количества непрочитанных уведомлений
const baseUrl = 'http://api-medical'
const token = localStorage.getItem('token')
const route = useRoute()

onMounted(async () => {
  const id = route.params.id
  await fetchNotifications(id)
})

const fetchNotifications = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/patients/${id}/notifications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)

    const data = await response.json()
    console.log(data)
    if (data && data.data) {
      notifications.value = data.data
      unreadCount.value = notifications.value.filter((n) => !n.is_read).length // Подсчет непрочитанных уведомлений
    }
  } catch (error) {
    console.error('Не удалось загрузить записи:', error)
  }
}
const goToAppointment = async (notification) => {
  console.log('Пытаемся пометить уведомление как прочитанное:', notification.id)
  await markAsRead(notification.id)
  console.log('Переход на страницу приема с уведомлением:', notification.appointment_id) // Используем appointment_id
  if (notification.appointment_id) {
    window.location = `/appointments/${notification.appointment_id}`
  } else {
    console.error('Нет идентификатора приема в уведомлении')
  }
}

const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${baseUrl}/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_read: true }),
    })

    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
    console.log('Уведомление успешно обновлено на сервере.')

    // Локально обновляем состояние уведомления
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.is_read = true
      unreadCount.value-- // Уменьшаем количество непрочитанных уведомлений
    }
  } catch (error) {
    console.error('Не удалось обновить уведомление:', error)
  }
}

const goApps = async () => {
  const id = route.params.id
  window.location = `/profile/${id}/appointments`
}

const goProfile = async () => {
  const id = route.params.id
  window.location = `/profile/${id}`
}

const goNot = async () => {
  const id = route.params.id
  window.location = `/profile/${id}/notifications`
}
</script>

<template>
  <div class="spec">
    <div class="title-inner">
      <h2 class="reviews-title">
        <a href="/" style="text-decoration: none; color: #2c9eae">Главная</a>
        /
        <span>Профиль пациента</span>
      </h2>
    </div>
    <button class="tabs2" @click="goProfile()">Общая информация</button>
    <button class="tabs2" @click="goApps()">Записи на прием</button>
    <button class="tabs" @click="goNot()">
      Уведомления
      <span v-if="unreadCount > 0" class="unread-count">{{ unreadCount }}</span>
      <!-- Отображение количества непрочитанных уведомлений -->
    </button>

    <div class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.is_read }"
        @click="goToAppointment(notification)"
      >
        <img
          v-if="notification.message.endsWith('ознакомиться с информацией')"
          :src="mark"
          alt="Завершён"
          class="notification-icon"
        />
        <img v-else :src="del" alt="Удалить" class="notification-icon" />
        <p>
          <span v-if="notification.message.includes('Приём номер')" class="appointment-link">
            <router-link class="link" :to="`/appointments/${notification.id}`">{{
              notification.message
            }}</router-link>
          </span>
          <span v-else>{{ notification.message }}</span>
        </p>
        <span class="notification-time">{{ formatDate(notification.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/profile-patient.css';

.notifications {
  margin-top: 20px;
}
.link {
  text-decoration: none;
  font-size: 23px;
  color: rgb(37, 155, 171);
}
.notification-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer; /* Добавлен курсор-указатель для интерактивности */
}
.notification-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.unread-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  margin-left: 8px;
  font-weight: bold;
}
.unread {
  background-color: #f0f8ff;
}
.notification-item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  flex-wrap: wrap;
  transition: background-color 0.3s ease;
}

.notification-time {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 18px;
  color: #888;
}
</style>
