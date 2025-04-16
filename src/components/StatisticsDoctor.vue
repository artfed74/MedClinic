<script setup>

import stats from '@/assets/images/bar-chart.png'
import doctor from '@/assets/images/doctor.png'
import patient from '@/assets/images/patient.png'
import logout from '@/assets/images/logout.png'
</script>

<template>
  <div class="stats-page">
    <aside class="sidebar">
      <h2 class="menu-title">Статистика</h2>
      <ul class="menu-list">
        <li>
          <router-link to="/statistics" class="menu-item">
            <img :src="stats" alt="Кнопка 1" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/statistics/doctors" class="menu-item">
            <img :src="doctor" alt="Кнопка 2" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/statistics/patients" class="menu-item">
            <img :src="patient" alt="Кнопка 3" style="width: 60px;height: 60px" />
          </router-link>
        </li>
        <li>
          <router-link to="/" class="menu-item">
            <img :src="logout" alt="Кнопка 3" style="width: 60px;height: 60px" />
          </router-link>
        </li>
      </ul>
    </aside>

  </div>
</template>

<style scoped>
@import "../assets/stats.css";

</style>
