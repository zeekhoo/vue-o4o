<template>
  <v-card class="mx-auto my-2" max-width="850">
    <v-card-title>
      Users
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          v-on:keyup="searchUsers"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :options.sync="options"
      :items="users"
      class="elevation-1"
      :loading="progressBarLoading"
      loading-text="Loading... Please wait"
      no-data-text="No Users"
      :hide-default-footer="true"
      loader-height="2"
    >
      <template v-slot:[`item.lastLogin`]="{ item }">{{offsetDate(item.lastLogin)}}</template>
      <template v-slot:[`item.action`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip 
                color="primary" 
                x-small
                outlined
                v-on="on"
                @click="userAction(item)"
            >Function</v-chip>
          </template>
          <v-card flat color="transparent" class="mx-auto">
            <div class="white--text caption">Click to invoke function</div>
          </v-card>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import config from '@/config';
import moment from "moment";

export default {
  name: "users",
  data: () => ({
      org: null,
      users: [],
      statusFilterString: "status+eq+%22ACTIVE%22+or+status+eq+%22STAGED%22+or+status+eq+%22RECOVERY%22+or+status+eq+%22DEPROVISIONED%22+or+status+eq+%22SUSPENDED%22+or+status+eq+%22PROVISIONED%22+or+status+eq+%22LOCKED_OUT%22+or+status+eq+%22PASSWORD_EXPIRED%22",
      headers: [
          { text: "First Name", value: "firstName", sortable: true, align: "start" },
          { text: "Last Name", value: "lastName", sortable: true },
          { text: "E-mail", value: "email", sortable: true },
          { text: "Status", value: "status", sortable: true },
          { text: "Last Login", value: "lastLogin", sortable: false },
          { text: "Actions", value: "action", sortable: false }
      ],
      profileFields: ['firstName', 'lastName', 'email'],
      options: {
          sortBy: ["firstName"],
          sortDesc: [false],
          multiSort: false
      },
      search: null,
      typingDelayTimer: null,
      lastSort: null,
      lastSortOrder: null,
      progressBarLoading: false,
  }),
  computed: {
    o4oToken() {
      return this.$store.getters.o4oToken;
    }
  },
  watch: {
    options: {
      async handler() {
        this.progressBarLoading = true;
        // Dispatch query
        await this.loadUsers();
      },
      deep: true
    }
  },
  async created() {
    this.org = config.oidc.issuer.split('/oauth2')[0];
    this.users = [];
  },
  methods: {
    getColor(status) {
      var color;
      switch (status) {
        case "ACTIVE":
          color = "black";
          break;
        case "DEPROVISIONED":
          color = "grey";
          break;
        case "DEACTIVATED":
          color = "grey";
          break;
        case "SUSPENDED":
          color = "orange";
          break;
        case "LOCKED_OUT":
          color = "orange";
          break;
        default:
          color = "blue";
      }
      return color;
    },
    async loadUsers() {
      this.progressBarLoading = true;

      const { sortBy, sortDesc } = this.options;
      if (sortBy.length <= 0) {
        sortBy.push(this.lastSort);
        sortDesc.push(!this.lastSortOrder);
      } else {
        this.lastSort = sortBy[0];
        this.lastSortOrder = sortDesc[0];
      }

      let params = '?';
      params += `sortBy=${this.profileFields.includes(sortBy[0]) ? 'profile.' + sortBy[0] : sortBy[0]}`;
      params += `&sortOrder=${sortDesc[0] ? "desc" : "asc"}`;

      if (this.search && this.search.length>0) {
        params += `&search=profile.firstName+sw+%22${this.search}%22+or+profile.lastName+sw+%22${this.search}%22+or+profile.login+sw+%22${this.search}%22`;
      } else {
        this.progressBarLoading = false;
        this.users = [];
        return
      }

      const res = await axios.get(this.org + '/api/v1/users' + params, {
        headers: { Authorization: "Bearer " + this.o4oToken }
      });
      if (res.data) {
        this.users = res.data.map(user => {
          return {
            id: user.id,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            status: user.status,
            lastLogin: user.lastLogin
          };
        });
      }

      this.progressBarLoading = false;
    },
    async searchUsers() {
      this.progressBarLoading = true;
      if (this.typingDelayTimer) {
        clearTimeout(this.typingDelayTimer);
      }
      const self = this;            
      this.typingDelayTimer = setTimeout(async function() {
        self.next = null;
        await self.loadUsers();
      }, 300);
    },
    async userAction(item) {
      console.log(item)
    },
    urlParams(query) {
        let urlParams = {};
        const search = /([^&=]+)=?([^&]*)/g;
        let match;
        while ((match = search.exec(query)) != null) {
            urlParams[match[1]] = match[2];
        }
        return urlParams;    
    },
    offsetDate(date, format) {
        if (!date || date.length <= 0) return '';
        
        const pattern = format ? format : 'MM/DD/YYYY HH:mm:ss'
        return moment(moment.utc(date).toDate())
            .local()
            .format(pattern);
    }    
  }
};
</script>
