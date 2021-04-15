export default {
  oidc: {
    client_id: process.env.VUE_APP_CLIENT_ID,
    issuer: process.env.VUE_APP_ISSUER,
    redirect_uri: process.env.VUE_APP_REDIRECT_URI,
    scopes: process.env.VUE_APP_SCOPES.split(' '),
    pkce: true,
  }
}