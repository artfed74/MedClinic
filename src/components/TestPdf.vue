<template>
  <div>
    <div id="pdf-content" style="padding: 20px; border: 1px solid #ccc;">
      {{ message }}
    </div>
    <button @click="saveAsPDF">Сохранить</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2pdf from 'html2pdf.js';

// Создаем реактивную переменную
const message = ref('Привет, Артем');

// Функция для сохранения PDF
const saveAsPDF = () => {
  const element = document.getElementById('pdf-content');
  const opt = {
    margin:       1,
    filename:     'document.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf()
    .from(element)
    .set(opt)
    .save();
};
</script>

<style scoped>
button {
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
