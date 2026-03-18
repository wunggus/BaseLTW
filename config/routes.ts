export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'HomeOutlined',
    component: './TrangChu',
  },

  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },

  {
    path: '/random-user',
    name: 'RandomUser',
    icon: 'ArrowsAltOutlined',
    component: './RandomUser',
  },

  {
    path: '/todo-list',
    name: 'TodoList',
    icon: 'OrderedListOutlined',
    component: './TodoList',
  },

  {
    name: 'ThucHanh',
    path: '/th',
    icon: 'AppstoreOutlined',
    routes: [
      {
        name: 'GuessNumber',
        path: '/th/guess-number',
        component: '@/components/TH/GuessNumber',
      },
      {
        name: 'StudyTracker',
        path: '/th/study-tracker',
        component: '@/components/TH/StudyTracker',
      },
      {
        name: 'Appointment',
        path: '/th/appointment',
        routes: [
          {
            name: 'Employees',
            path: '/th/appointment/employees',
            component: './appointment/employees',
          },
          {
            name: 'Services',
            path: '/th/appointment/services',
            component: './appointment/services',
          },
          {
            name: 'Bookings',
            path: '/th/appointment/bookings',
            component: './appointment/bookings',
          },
          {
            name: 'Reviews',
            path: '/th/appointment/reviews',
            component: './appointment/reviews',
          },
          {
            name: 'Reports',
            path: '/th/appointment/reports',
            component: './appointment/reports',
          },
        ],
      },
    ],
  },

  {
    path: '/notification',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        path: '/notification/subscribe',
        exact: true,
        component: './ThongBao/Subscribe',
      },
      {
        path: '/notification/check',
        exact: true,
        component: './ThongBao/Check',
      },
      {
        path: '/notification',
        exact: true,
        component: './ThongBao/NotifOneSignal',
      },
    ],
  },

  {
    path: '/403',
    component: './exception/403/403Page',
    layout: false,
  },

  {
    path: '/hold-on',
    component: './exception/DangCapNhat',
    layout: false,
  },

  {
    component: './exception/404',
  },
];