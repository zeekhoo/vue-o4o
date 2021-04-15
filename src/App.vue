<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title class="headline text-uppercase">
                <span class="font-weight-light">OAuth for Okta</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <div v-if="authState.isAuthenticated">
                <v-btn text @click="home()">
                    <v-icon 
                        left 
                        dark 
                    >mdi-home</v-icon>Home
                </v-btn>
            </div>

            <router-link
                to="/login"
                v-if="!authState.isAuthenticated"
            >
                <v-btn text>Login</v-btn>
            </router-link>
            <v-btn v-else text @click="logout">Logout</v-btn>

        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
  }),
  computed: {
  },
  methods: {
    async logout() {
      if (this.authState.isAuthenticated) {
        this.$store.commit("logout");
        await this.$auth.signOut();
      }
    },
    home() {
      if (window.location.pathname != '/')
        this.$router.push({name: 'home'})
    }

  }
};
</script>
