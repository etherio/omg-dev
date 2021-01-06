# omg

![Deploy to Firebase Web Hosting](https://github.com/etherio/omg-dev/workflows/Deploy%20to%20Firebase%20Web%20Hosting/badge.svg)

[![Netlify Status](https://api.netlify.com/api/v1/badges/4a1fea98-6608-4e58-a29b-ebf2f2d7910b/deploy-status)](https://app.netlify.com/sites/serene-galileo-f84e05/deploys)

## Installation

```sh
npm install
```

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Static Site
1. Website ([omg.etherio.net](https://omg.etherio.net))

### Server-Side
1. Firebase Admin ([omg-api.etherio.net](https://omg-api.etherio.net))
2. Image Rendering ([api.etherio.net](https://api.etherio.net))

## Firebase Configuration

### Authentication

**Sign-In Methods**

- Email / Password
- Google
- Facebook

> **Multiple accounts per email address:** Allow users to create multiple accounts for authentication providers that use the same email address.

### Firestore (Indexes)

```json
{
  "indexes": [
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "stock",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Firestore (Rule)

```js
service cloud.firestore {
  match /databases/{document}/documents {

    function isLogin() {
      return request.auth != null &&
      request.auth.uid != null;
    }

    function hasRole() {
      return request.auth.token != null &&
      request.auth.token.role != null;
    }

    function isAdmin() {
      return request.auth.token.role == 'admin';
    }

    function isModerator() {
      return request.auth.token.role == 'moderator';
    }

    match /public/{database} {
      match /{collection}/{anyPath=**} {
        allow read: if isLogin() && hasRole() && isModerator();
        allow write: if isLogin() && hasRole() && isAdmin();
      }
    }
  }
}
```

### Realtime Database (Rule)

```json
{
  "rules": {
    "$database": {
      "metadata": {
        ".read": "auth.token.role != null && auth.token.role == 'moderator' || auth.token.role == 'admin'",
        ".write": "auth.token.role != null && auth.token.role == 'admin'"
      },
      "colors": {
        ".read": "auth.token.role != null && auth.token.role == 'moderator' || auth.token.role == 'admin'",
        ".write": "auth.token.role != null && auth.token.role == 'admin'"
      },
      "categories": {
        ".read": "auth.token.role != null && auth.token.role == 'moderator' || auth.token.role == 'admin'",
        ".write": "auth.token.role != null && auth.token.role == 'admin'"
      },
      "products": {
        ".indexOn": "createdAt",
        ".read": "auth.token.role != null && auth.token.role == 'moderator' || auth.token.role == 'admin'",
        ".write": "auth.token.role != null && auth.token.role == 'admin'"
      },
      "inventory": {
        ".read": "auth.token.role != null && auth.token.role == 'moderator' || auth.token.role == 'admin'",
        ".write": "auth.token.role != null && auth.token.role == 'admin'"
      }
    }
  }
}
```

### Storage [Rule]

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{document=**} {
      allow read, write: if request.auth!=null;
    }
  }
}
```

## Functions

**Using**

- [Netlify](https://netlify.com) Lambda Functions
