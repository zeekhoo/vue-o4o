# vue-o4o

## Project setup

1. Create a file named `.env.development.local` in root and populate with the following values:
```
VUE_APP_CLIENT_ID=<client_id e.g. 0oayjm85brCCnaSc70h7>
VUE_APP_ISSUER=<issuer uri. e.g https://my-org.oktapreview.com/oauth2/default>
VUE_APP_REDIRECT_URI=http://localhost:8080/oauth/callback
VUE_APP_SCOPES=openid profile email
```

2. Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```