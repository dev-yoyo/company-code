
var router = [
  {
    path: '/put',
    name: 'put',
    meta: {
      icon: 'icon-ykb-yyzx',
      title: '应用中心',
      role: [1, 2]
    },
    component: () => import('@/views/put/index.vue')
  },
  {
    path: '/company',
    name: 'company',
    meta: {
      icon: 'icon-ykb-qyxx',
      title: '企业信息',
      role: [1, 2]
    },
    component: () => import('@/views/company/index.vue')
  },
  {
    path: '/org',
    name: 'org',
    meta: {
      icon: 'icon-ykb-zzqx',
      title: '组织权限',
      role: [1, 2]
    },
    component: () => import('@/views/org/index.vue'),
    children: [
      {
        path: '/frame',
        name: 'frame',
        meta: {
          icon: 'icon-ykb-zzjg',
          title: '组织架构',
          role: [1, 2]
        },
        component: () => import('@/views/org/frame.vue')
      },
      // {
      //   path: '/role',
      //   name: 'role',
      //   meta: {
      //     icon: 'icon-ykb-ghkh',
      //     title: '角色权限'
      //   },
      //   component: () => import('@/views/org/role.vue')
      // },
    ]
  }, 
  {
    path: '/work',
    name: 'work',
    meta: {
      icon: 'icon-ykb-ywgl',
      title: '业务管理',
      role: [1, 2, 3]
    },
    component: () => import('@/views/work/index.vue'),
    children: [
      {
        path: '/target',
        name: 'target',
        meta: {
          icon: 'icon-ykb-yjmb',
          title: '业绩目标',
          role: [1, 2, 3]
        },
        component: () => import('@/views/work/target.vue')
      },
      // {
      //   path: '/flow',
      //   name: 'flow',
      //   meta: {
      //     icon: 'icon-ykb-ghkh',
      //     title: '审批流程'
      //   },
      //   component: () => import('@/views/work/flow.vue')
      // },
      {
        path: '/cate',
        name: 'cate',
        meta: {
          icon: 'icon-ykb-cplm',
          title: '产品类目',
          role: [1, 2]
        },
        component: () => import('@/views/work/cate.vue')
      },
    ]
  },
]

export default router