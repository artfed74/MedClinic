// src/auth.js
import { reactive } from 'vue';

const auth = reactive({
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  patient_id: localStorage.getItem('patient_id') || null,
  doctor_id: localStorage.getItem('doctor_id') || null,
  admin_id: localStorage.getItem('admin_id') || null,
  login(data) {
    this.token = data.token;
    this.role = data.role;
    this.patient_id = data.patient_id;
    this.doctor_id = data.doctor_id;
    this.admin_id = data.admin_id;
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('patient_id', data.patient_id);
    localStorage.setItem('doctor_id', data.doctor_id);
    localStorage.setItem('admin_id', data.admin_id);
  },
  logout() {
    this.token = null;
    this.role = null;
    this.patient_id = null;
    this.doctor_id = null;
    this.admin_id = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('patient_id');
    localStorage.removeItem('doctor_id');
    localStorage.removeItem('admin_id');
  }
});

export default auth;
