import Vue from 'vue'
import Router from 'vue-router'

import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue from '@okta/okta-vue'

import HomeComponent from '@/components/Home'
import LoginComponent from '@/components/Login'
import Users from "@/components/Users";

import config from '@/config'

const oktaAuth = new OktaAuth({
  clientId: config.oidc.client_id,
  issuer: config.oidc.issuer,
  redirectUri: config.oidc.redirect_uri,
  scopes: config.oidc.scopes
})

Vue.use(Router)
Vue.use(OktaVue, {
  oktaAuth,
  onAuthRequired: () => {
    router.push('/login')
  }
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComponent,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/users",
      name: "users",
      component: Users,
      meta: {
        title: "Users",
        requiresAuth: true,
      },
    },

  ]
})

export default router