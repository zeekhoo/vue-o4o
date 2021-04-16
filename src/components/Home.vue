<template>
  <v-card class="mx-auto" max-width="700" flat>
    <v-container fluid>
      <div v-if="!authState.isAuthenticated">
        <v-col>
          <v-card-title
            flat
            color="transparent"
            >
            <div>Please <a href="/login">login</a></div>
          </v-card-title>            
        </v-col>
      </div>
      <v-row v-else dense>
        <v-col v-for="card in cards" :key="card.name" :cols="card.flex">
          <v-card 
            v-if="!ready"
            height="300" 
            >
            <v-overlay
              :absolute="true"
              :value="!ready"
              opacity=".1"
              >
              <v-progress-circular
                size="80"
                width="12"
                color="grey"
                indeterminate
                >
              </v-progress-circular>
            </v-overlay>
          </v-card>
          <v-card 
            v-else
            height="300" 
            hover 
            @click="routeTo(card.route)">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  {{ card.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ card.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-icon size="80">mdi-{{ card.icon }}</v-icon>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { OktaAuth } from "@okta/okta-auth-js";
import config from '@/config'


export default {
  name: "home",
  data() {
    return {
      cards: [
        {
          name: "Users",
          subtitle: "Search users",
          icon: "account",
          flex: 6,
          route: "users",
        }
      ],
      ready: false,
    };
  },
  async created() {
    await this.initO4o();
  },
  methods: {
    async initO4o() {
      if (!this.authState.isAuthenticated) {
        console.log('Not Authenticated.')
        return
      }
      const o4oToken = this.$store.state.o4oToken;
      if (o4oToken && o4oToken.length > 0) {
        // token is already in vuex
        this.ready = true;
        return
      }

      const authJs = new OktaAuth({
        issuer: config.oidc.issuer.split("oauth2")[0],
        clientId: config.oidc.client_id,
        redirectUri: config.oidc.redirect_uri,
        pkce: true,
      });
      const exists = await authJs.session.exists();
      if (exists) {
        try {
          const res = await authJs.token.getWithoutPrompt({
            scopes: ["openid", "okta.users.manage", "okta.groups.manage"],
          });
          const accessToken = res.tokens.accessToken;

          // vuex
          this.$store.commit("setO4oToken", accessToken.accessToken);
          this.ready = true;

          this.$store.subscribe((mutation, state) => {
            console.log("Got mutation", mutation.type, ", state=", state);
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    routeTo(route) {
      const token = this.$store.state.o4oToken;
      if (!token || token.length <= 0) {
        window.location.href = "/" + route;
      } else {
        this.$router.push("/" + route);
      }
    },
  },
};
</script>
