<template>
  <div class="login">
    <div id="okta-signin-container"></div>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import config from '@/config'
export default {
  name: 'Login',
  mounted: function () {
    this.$nextTick(function () {
      const { issuer, client_id, redirect_uri, scopes } = config.oidc
      this.widget = new OktaSignIn({
        baseUrl: issuer.split('/oauth2')[0],
        clientId: client_id,
        redirectUri: redirect_uri,
        logo: require('@/assets/logo.png'),
        authParams: {
          issuer,
          scopes,
        }
      })
      this.widget.showSignInToGetTokens({
        el: '#okta-signin-container',
        scopes
      }).then(tokens => {
        this.$auth.handleLoginRedirect(tokens)
      }).catch(err => {
        throw err
      })
    })
  },
  destroyed () {
    // Remove the widget from the DOM on path change
    this.widget.remove()
  }
}
</script>