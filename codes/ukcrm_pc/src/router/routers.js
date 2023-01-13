
var router = [
  {
    path: '/home',
    name: 'home',
    meta: {
      icon: 'icon-ykb-sy',
      title: '首页'
    },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      icon: 'icon-ykb-khgl',
      title: '客户管理'
    },
    component: () => import('@/views/customer/index.vue'),
    children: [
      {
        path: '/my_customer',
        name: 'my_customer',
        meta: {
          icon: 'icon-ykb-kh',
          title: '我的客户'
        },
        component: () => import('@/views/customer/myCustomer.vue')
      },
      {
        path: '/seas_customer',
        name: 'seas_customer',
        meta: {
          icon: 'icon-ykb-ghkh',
          title: '公海池客户'
        },
        component: () => import('@/views/customer/seasCustomer.vue')
      },
      {
        path: '/recycle_customer',
        name: 'recycle_customer',
        meta: {
          icon: 'icon-ykb-hsz',
          title: '回收站',
          role: [1, 2],
        },
        component: () => import('@/views/customer/recycleCustomer.vue')
      },
      {
        path: '/my_customer_detail',
        name: 'my_customer',
        meta: {
          title: '客户详情',
          hideMenu: true
        },
        component: () => import('@/views/customer/detail.vue')
      },
      {
        path: '/recycle_customer_detail',
        name: 'recycle_customer',
        meta: {
          title: '客户详情',
          hideMenu: true
        },
        component: () => import('@/views/customer/detail.vue')
      },
      {
        path: '/seas_customer_detail',
        name: 'seas_customer',
        meta: {
          title: '客户详情',
          hideMenu: true
        },
        component: () => import('@/views/customer/seasDetail.vue')
      },
    ]
  },
  {
    path: '/pay',
    name: 'pay',
    meta: {
      icon: 'icon-ykb-jygl',
      title: '交易管理'
    },
    component: () => import('@/views/transaction_management/index.vue'),
    children: [
      {
        path: '/offer',
        name: 'offer',
        meta: {
          icon: 'icon-ykb-bj',
          title: '报价'
        },
        component: () => import('@/views/transaction_management/offer/list.vue')
      },
      {
        path: '/contract',
        name: 'contract',
        meta: {
          icon: 'icon-ykb-ht',
          title: '合同'
        },
        component: () => import('@/views/transaction_management/contract/list.vue')
      },
      {
        path: '/returnMoney',
        name: 'returnMoney',
        meta: {
          icon: 'icon-ykb-hk',
          title: '回款'
        },
        component: () => import('@/views/transaction_management/returnMoney/list.vue')
      },
    ]
  },
  {
    path: '/product',
    name: 'product',
    meta: {
      icon: 'icon-ykb-cp',
      title: '产品'
    },
    component: () => import('@/views/product/index.vue')
  },
  // {
  //   path: '/system',
  //   name: 'system',
  //   meta: {
  //     icon: 'icon-ykb--xtsz',
  //     title: '系统设置',
  //     role: [1, 2, 3]
  //   },
  // }
]

export default router