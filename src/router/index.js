import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import Registration from '@/components/Registration.vue'
import LoginForm from '@/components/LoginForm.vue'
import Reviews from '@/components/Reviews.vue'
import Doctors from '@/components/Doctors.vue'
import DoctorPage from '@/components/DoctorPage.vue'
import SetReview from '@/components/SetReview.vue'
import PatientProfile from '@/components/PatientProfile.vue'
import CreateService from '@/components/CreateService.vue'
import ReductService from '@/components/ReductService.vue'
import CreateDoctor from '@/components/CreateDoctor.vue'
import CreateMedcard from '@/components/CreateMedcard.vue'
import Rooms from '@/components/Rooms.vue'
import SetRoom from '@/components/SetRoom.vue'
import CreateSchedule from '@/components/CreateSchedule.vue'
import ReductSchedule from '@/components/ReductSchedule.vue'
import PatientAppointments from '@/components/PatientAppointments.vue'
import DoctorAppointments from '@/components/DoctorAppointments.vue'
import CreateAppointment from '@/components/CreateAppointment.vue'
import AppointmentInfo from '@/components/AppointmentInfo.vue'
import CreatePrescription from '@/components/CreatePrescription.vue'
import TestPdf from '@/components/TestPdf.vue'
import TestStar from '@/components/TestStar.vue'
import AccessDenied from '@/components/AccessDenied.vue'
import NotFound from '@/components/NotFound.vue'
import PatientNotifications from '@/components/PatientNotifications.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginForm,
    },
    {
      path: '/reviews',
      name: 'Reviews',
      component: Reviews,
    },
    {
      path: '/doctors',
      name: 'Doctors',
      component: Doctors,
    },
    {
      path: '/doctors/:id',
      name: 'DoctorPage',
      component: DoctorPage,
    },
    {
      path: '/reviews/create',
      name: 'SetReview',
      component: SetReview,
    },
    {
      path: '/profile/:id',
      name: 'PatientProfile',
      component: PatientProfile,
    },
    {
      path: '/service/create/:id',
      name: 'CreateService',
      component: CreateService,
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/service/update/:id',
      name: 'ReductService',
      component: ReductService,
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/doctors/create',
      name: 'CreateDoctor',
      component: CreateDoctor,
    },
    {
      path: '/patients/:id/medcard/create',
      name: 'CreateMedcard',
      component: CreateMedcard,
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: Rooms,
    },
    {
      path: '/rooms/create',
      name: 'SetRoom',
      component: SetRoom,
    },
    {
      path: '/doctors/schedules/create/:id',
      name: 'CreateSchedule',
      component: CreateSchedule,
    },
    {
      path: '/doctors/schedules/edit/:id',
      name: 'ReductSchedule',
      component: ReductSchedule,
    },
    {
      path: '/profile/:id/appointments',
      name: 'PatientAppointments',
      component: PatientAppointments,
    },
    {
      path: '/profile/:id/notifications',
      name: 'PatientNotifications',
      component: PatientNotifications,
    },
    {
      path: '/doctor/:id/appointments',
      name: 'DoctorAppointments',
      component: DoctorAppointments,
    },
    {
      path: '/appointments/create/:id',
      name: 'CreateAppointment',
      component: CreateAppointment,
    },
    {
      path: '/appointments/:id',
      name: 'AppointmentInfo',
      component: AppointmentInfo,
    },
    {
      path: '/prescriptions/create/:id',
      name: 'CreatePrescription',
      component: CreatePrescription,
    },
    {
      path: '/test',
      name: 'TestPdf',
      component: TestPdf,
    },
    {
      path: '/access-denied',
      name: 'AccessDenied',
      component: AccessDenied,
    },
    {
      path: '/:pathMatch(.*)*', 
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/testi',
      name: 'TestStar',
      component: TestStar,
    }


  ],
})
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const protectedRoutes = ['/appointments/create', '/reviews/create'];

  const adminRoutes = ['/rooms/create', '/doctors/create', '/doctors/schedules/create','/doctors/schedules/edit'];

  const adminRoutesWithParams = adminRoutes.map(route => {
    return new RegExp(`^${route.replace(':id', '\\d+')}`);
  });

  if (
    adminRoutesWithParams.some(regex => regex.test(to.path)) &&
    (!isAuthenticated || userRole !== 'Администратор')
  ) {
    next('/access-denied');
  } else if (protectedRoutes.some(route => to.path.startsWith(route)) && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && (!isAuthenticated || userRole !== 'Администратор')) {
    next('/access-denied');
  } else {
    next();
  }
});
export default router
