# Carbono Authentication Server

Description
===========

This module provides auth2 authentication to be used by various carbono
modules, using the IMPERIAL account manager as the persistence model of
of "oauth2-server" project.

How to use
==========
```npm install```

```node .```

```
curl --data "grant_type=password&client_id=moura&client_secret=carbono123&username=danielmoura&password=carbono123" --header "Content-Type: application/x-www-form-urlencoded" http://localhost:3000/oauth/token
```

```
curl http://localhost:3000/?access_token=abcd1234
```

More information
================
https://www.npmjs.com/package/oauth2-server
