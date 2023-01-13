
var router = [
  {
    path: '/workbench',
    name: 'workbench',
    meta: {
      icon: 'icon-gzt-xmgl',
      title: '工作台',
      role: [1, 2, 3, 4]
    },
    redirect: 'project',
    component: () => import('@/views/workbench/workbench.vue'),
    children: [
      {
        path: 'board',
        name: 'board',
        meta: {
          icon: 'icon-gzt-xmkb',
          title: '数据看板',
          role: [1]
        },
        component: () => import('@/views/workbench/board/board.vue'),
      },
      {
        path: 'project',
        name: 'project',
        meta: {
          icon: 'icon-gzt-xmgl',
          title: '项目管理',
          role: [1, 2, 3, 4]
        },
        component: () => import('@/views/workbench/project/project.vue'),
      },
      {
        path: 'projectDetail',
        name: 'projectDetail',
        meta: {
          title: '项目管理详情',
          hideMenu: true,
          role: [1, 2, 3, 4],
        },
        component: () => import('@/views/workbench/project/projectDetail.vue'),
      },

      {
        path: 'projectdIrector',
        name: 'projectdIrector',
        meta: {
          icon: 'icon-gzt-xmjlgl',
          title: '项目经理管理',
          role: [1]
        },
        component: () => import('@/views/workbench/projectdIrector/projectdIrector.vue')
      },
      {
        path: 'projectdIrectorDetail',
        name: 'projectdIrectorDetail',
        meta: {
          title: '项目经理管理详情',
          role: [1],
          hideMenu: true
        },
        component: () => import('@/views/workbench/projectdIrector/projectdIrectorDetail.vue')
      },

      {
        path: 'team',
        name: 'team',
        meta: {
          icon: 'icon-gzt-tdgl',
          title: '团队管理',
          role: [1]
        },
        component: () => import('@/views/workbench/team/team.vue'),
      },
      {
        path: 'teamDetail',
        name: 'teamDetail',
        meta: {
          title: '团队管理详情',
          role: [1],
          hideMenu: true
        },
        component: () => import('@/views/workbench/team/teamDetail.vue')
      },
      {
        path: 'client',
        name: 'client',
        meta: {
          icon: 'icon-gzt-khgl',
          title: '客户管理',
          role: [1]
        },
        component: () => import('@/views/workbench/client/client.vue')
      },
      {
        path: 'hall',
        name: 'hall',
        meta: {
          icon: 'icon-gzt-khgl',
          title: '项目大厅',
          role: [1,2,3,4],
          hideMenu: true
        },
        component: () => import('@/views/workbench/hall/hall.vue')
      },
      {
        path: 'message',
        meta: {
          icon: 'icon-gzt-khgl',
          title: '消息中心',
          role: [1,2,3,4],
          hideMenu: true
        },
        component: () => import('@/views/workbench/message/message.vue')
      },
      
      {
        path: 'userCenter',
        meta: {
          icon: 'icon-gzt-khgl',
          title: '个人中心',
          role: [1,2,3,4],
          hideMenu: true
        },
        component: () => import('@/views/workbench/userCenter/userCenter.vue')
      },

      {
        path: 'clientDetail',
        name: 'clientDetail',
        meta: {
          title: '客户管理详情',
          role: [1],
          hideMenu: true
        },
        component: () => import('@/views/workbench/client/clientDetail.vue')
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'icon-gzt-yhgl',
          title: '用户管理',
          role: [1]
        },
        component: () => import('@/views/workbench/user/user.vue')
      },

      {
        path: 'userDetail',
        name: 'userDetail',
        meta: {
          title: '用户管理详情',
          role: [1],
          hideMenu: true
        },
        component: () => import('@/views/workbench/user/userDetail.vue')
      },
      {
        path: 'assess',
        name: 'assess',
        meta: {
          icon: 'icon-gzt-pjgl',
          title: '评价管理',
          role: [1, 2, 3, 4]
        },
        component: () => import('@/views/workbench/assess/assess.vue')
      },
      {
        path: 'teamSeniority',
        name: 'teamSeniority',
        meta: {
          icon: 'icon-gzt-tdgl',
          title: '团队资历',
          role: [3]
        },
        component: () => import('@/views/workbench/teamSeniority/teamSeniority.vue')
      },
      {
        path: 'member',
        name: 'member',
        meta: {
          icon: 'icon-gzt-khgl',
          title: '成员管理',
          role: [3]
        },
        component: () => import('@/views/workbench/member/member.vue')
      },

      {
        path: 'memberDetail',
        name: 'memberDetail',
        meta: {
          title: '成员详情管理',
          role: [3],
          hideMenu: true,
        },
        component: () => import('@/views/workbench/member/memberDetail.vue')
      },
      {
        path: 'personalSeniority',
        name: 'personalSeniority',
        meta: {
          icon: 'icon-gzt-tdgl',
          title: '个人资历',
          role: [4]
        },
        component: () => import('@/views/workbench/personalSeniority/personalSeniority.vue')
      },
      // {
      //   path: 'myOnlookers',
      //   name: 'myOnlookers',
      //   meta: {
      //     icon: 'icon-xmdt-wg',
      //     title: '我的围观',
      //     role: [4]
      //   },
      //   component: () => import('@/views/workbench/myOnlookers/myOnlookers.vue')
      // },
    ],
  },
  // 
 
  {
    path: '/public',
    name: 'public',
    meta: {
      title: '公域',
      role: [1,2],
      hideMenu: true,
    },
    component: () => import('@/views/publish_project/public.vue')
  },
  {
    path: '/private',
    name: 'private',
    meta: {
      title: '私域',
      role: [1,2],
      hideMenu: true,
    },
    component: () => import('@/views/publish_project/private.vue')
  },
  {
    path: '/help',
    name: 'help',
    meta: {
      // icon: 'icon-ykb-sy',
      title: '帮助中心',
      role: 'help'
    },
    component: () => import('@/views/help/help.vue'),
    children:[
      {
        path: 'guide',
        name: 'guide',
        meta: {
          title: '新手指南',
        },
        redirect:'authentication',
        component: () => import('@/views/help/guide/index.vue'),
        
        children:[
          {
            path: 'authentication',
            name: 'authentication',
            meta: {
              title: '如何认证身份',
            },
            component: () => import('@/views/help/guide/authentication.vue')
          },
          {
            path: 'bidRate',
            name: 'bidRate',
            meta: {
              title: '如何提高竞价成功率',
            },
            component: () => import('@/views/help/guide/bidRate.vue')
          },
          // {
          //   path: 'progress',
          //   name: 'progress',
          //   meta: {
          //     title: '如何跟进项目进度',
          //   },
          //   component: () => import('@/views/help/guide/progress.vue')
          // },
          {
            path: 'expenses',
            name: 'expenses',
            meta: {
              title: '如何结算费用',
            },
            component: () => import('@/views/help/guide/expenses.vue')
          },
        ],
      },
      {
        path: 'problem',
        name: 'problem',
        meta: {
          title: '常见问题',
        },
        redirect:'role',
        component: () => import('@/views/help/problem/index.vue'),
        children:[
          {
            path: 'role',
            name: 'role',
            meta: {
              title: '身份角色常见问题',
            },
            component: () => import('@/views/help/problem/role.vue')
          },
          {
            path: 'account',
            name: 'account',
            meta: {
              title: '账号常见问题',
            },
            component: () => import('@/views/help/problem/account.vue')
          },
          // {
          //   path: 'listing',
          //   name: 'listing',
          //   meta: {
          //     title: '项目常见问题',
          //   },
          //   component: () => import('@/views/help/problem/listing.vue')
          // },
          {
            path: 'cost',
            name: 'cost',
            meta: {
              title: '费用结算常见问题',
            },
            component: () => import('@/views/help/problem/cost.vue')
          },
          {
            path: 'bond',
            name: 'bond',
            meta: {
              title: '保证金常见问题',
            },
            component: () => import('@/views/help/problem/bond.vue')
          },
          // {
          //   path: 'cooperate',
          //   name: 'cooperate',
          //   meta: {
          //     title: '合作评价常见问题',
          //   },
          //   component: () => import('@/views/help/problem/cooperate.vue')
          // },
        ],
      },
      {
        path: 'rule',
        name: 'rule',
        meta: {
          title: '平台规则',
        },
        redirect:'notice',
        component: () => import('@/views/help/rule/index.vue'),
        children:[
          {
            path: 'notice',
            name: 'notice',
            meta: {
              title: '用户协议',
            },
            component: () => import('@/views/help/rule/notice.vue')
          },
          {
            path: 'behavior',
            name: 'behavior',
            meta: {
              title: '用户行为准则',
            },
            component: () => import('@/views/help/rule/behavior.vue')
          },
          // {
          //   path: 'tier',
          //   name: 'tier',
          //   meta: {
          //     title: '等级规则',
          //   },
          //   component: () => import('@/views/help/rule/tier.vue')
          // },
          // {
          //   path: 'cashOut',
          //   name: 'cashOut',
          //   meta: {
          //     title: '提现规则',
          //   },
          //   component: () => import('@/views/help/rule/cashOut.vue')
          // },
        ],
      },
    
    ],
  },


]
export default router