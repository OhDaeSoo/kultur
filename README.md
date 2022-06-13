# kult(u)r
A personal project repository made with Angular.
Born from the will to rate movies, music and video games.

# Setup

At the same level than the src/app directory, you will need to create a directory src/environments with two files environment.ts & environment.prod.ts in it. These files have to be filled up with your personal ID and secret key if you want to plug it with web services of Spotify, Twitch etc.

So here are the constants :

```
export const environment = {
  production: false | true,
  firebaseAPIKey: '',
  tmdbAPIKeyV3: '',
  tmdbAPIKeyV4: '',
  igdbAPIUserKey: '',
  twitchAPIClientID: '',
  twitchAPIClientSECRET: '',
  spotifyClientID: '',
  spotifyClientSECRET: ''
};
```
# Run

To run the app you need to pass threw the proxy provided by Angular as follow :

```
ng serve --proxy-config src/proxy.conf.json
```
