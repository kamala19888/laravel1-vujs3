import { createRouter, createWebHistory } from 'vue-router'
import {isUserLoggedIn} from './utils'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('../pages/Login.vue')
        },
        {
            path: '/reset-password-form-sent',
            name: 'ResetPasswordFormSent',
            component: () => import('../pages/ResetPasswordFormSent.vue')
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import('../pages/Admin.vue')
        },
        {
            path: '/users',
            name: 'Users',
            component: () => import('../pages/users/User.vue')
        },
        {
            path: '/permissions',
            name: 'Permissions',
            component: () => import('../pages/permissions/Permissions.vue')
        },
        {
            path: '/pages',
            name: 'Pages',
            component: () => import('../pages/pages/Page.vue')
        },
        {
            path: '/roles',
            name: 'Roles',
            component: () => import('../pages/roles/Role.vue')
        },
        {
            path: '/app-fonts',
            name: 'AppFonts',
            component: () => import('../pages/appFonts/AppFont.vue')
        },
        {
            path: '/general-settings',
            name: 'GeneralSettings',
            component: () => import('../pages/generalSettings/GeneralSetting.vue')
        },
        {
            path: '/translates',
            name: 'Translates',
            component: () => import('../pages/translates/translate.vue')
        },

        {
            path: '/profile',
            name: 'Profile',
            component: () => import('../pages/Profile.vue')
        },
        {
            path: '/:pathMatch(.*)*',

            component: () => import('../pages/notFound.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isUserLoggedIn())
     {
        next({ name: 'Login' })
     }
    else if (to.name === 'Login' && isUserLoggedIn()) {
        next({ name: 'Admin' })
    }
    else {
        next()
    }


});
export default router
