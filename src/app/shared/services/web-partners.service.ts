import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { pipe, throwError } from 'rxjs';
import { map, catchError, tap, mergeMap, switchMap } from 'rxjs/operators';

export interface TmdbDTO {
  movieTmdbId: string, // Identifiant TMDB du film
  movieYear: string, // Annee de sortie du film
  movieTitle: string, // Titre du film
  moviePosterUrl: string // Url de l'affiche du film
}

export interface IgdbDTO {
  gameIgdbId: string, // Identifiant IGDB du jeu
  gameYear: string, // Annee de sortie du jeu
  gameTitle: string, // Titre du jeu
  gamePosterUrl: string // Url de l'affiche du jeu
  gamePlatform: string // Plateforme du jeu (PS4, Nintendo Switch, PC etc.)
}

export interface SpotifyDTO {
  albumSpotifyId: string, // Identifiant Spotify de l'album
  albumArtist: string, // Interprete de l'album
  albumTitle: string, // Titre de l'album
  albumYear: string, // Annee de sortie de l'album
  albumPosterUrl: string // Url de la pochette de l'album
}

@Injectable({providedIn: 'root'})
export class WebPartnersService {

  constructor(private httpClient: HttpClient) {}

  moviesTmdbDTO: TmdbDTO[] = [];
  gamesIgdbDTO: IgdbDTO[] = [];
  albumsSpotifyDTO: SpotifyDTO[] = [];
  private timerSpotifyExpirToken: any;
  private timerTwitchExpirToken: any;

  searchMediaInfos(words: string, category: string): any {
    switch(category) {
      case 'movie':
        this.moviesTmdbDTO = [];
        return this.httpClient
        .get(
          'https://api.themoviedb.org/3/search/movie?api_key='
          + environment.tmdbAPIKeyV3
          + '&language=fr-FR&query='
          + words
        ).pipe(
          catchError(this.handleErrorGetTmdbData),
          map((resData: any) => {
            resData.results.filter(element => element.poster_path).forEach((element: any) => {
              this.moviesTmdbDTO.push({
                movieTmdbId: element.id,
                movieYear: element.release_date.substring(0,4),
                movieTitle: element.title,
                moviePosterUrl: 'https://image.tmdb.org/t/p/w1280'+element.poster_path
              });
            });
            return this.moviesTmdbDTO;
          })
        );
        break;

      case 'game':
        this.gamesIgdbDTO = [];
        if (localStorage.getItem("twitchAccessToken")) {
          // Appel au endpoint de recherche Igdb pour une durée d'une heure
          this.gamesIgdbDTO = this.makeSearchOnIgdb(words, localStorage.getItem("twitchAccessToken"));
          return this.gamesIgdbDTO;
        } else {
          // Demande d'un jeton d'authentification auprès du service Twitch
          return this.httpClient
          .post('https://id.twitch.tv/oauth2/token',
          '',
          {
            params: {
              'client_id': environment.twitchAPIClientID,
              'client_secret': environment.twitchAPIClientSECRET,
              'grant_type': 'client_credentials'
            }
          })
          .pipe(
            tap((resTwitchToken: any) => {
              // Stockage (localstorage) du twitchAccessToken (de type Bearer) par exemple : "Bearer fgdjfgR4kkdfhhg55kgkgfkf"
              localStorage.setItem("twitchAccessToken", resTwitchToken.token_type + " " + resTwitchToken.access_token);
              this.timerTwitchExpirToken = setTimeout(() => {
                this.removeTwitchTokenFromLS();
              }, resTwitchToken.expires_in * 1000);
            }),
            switchMap((resTwitchToken: any) => {
              // Appel au endpoint de recherche Igdb pour une durée d'une heure
              this.gamesIgdbDTO = this.makeSearchOnIgdb(words, resTwitchToken.token_type + " " + resTwitchToken.access_token);
              return this.gamesIgdbDTO;
            })
          );
        }
        break;

      case 'album':
        this.albumsSpotifyDTO = [];
        if (localStorage.getItem("spotifyAccessToken")) {
          // Appel au endpoint de recherche Spotify pour une durée d'une heure
          this.albumsSpotifyDTO = this.makeSearchOnSpotify(words, localStorage.getItem("spotifyAccessToken"));
          return this.albumsSpotifyDTO;
        } else {
          // Demande d'un jeton d'authentification auprès du service Spotify
          return this.httpClient
          .post('https://accounts.spotify.com/api/token',
          "grant_type=client_credentials",
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(environment.spotifyClientID + ":" + environment.spotifyClientSECRET)
            }
          })
          .pipe(
            tap((resSpotifyToken: any) => {
              // Stockage (localstorage) du spotifyAccessToken (de type Bearer) par exemple : "Bearer fgdjfgR4kkdfhhg55kgkgfkf"
              localStorage.setItem("spotifyAccessToken", resSpotifyToken.token_type + " " + resSpotifyToken.access_token);
              this.timerSpotifyExpirToken = setTimeout(() => {
                this.removeSpotifyTokenFromLS();
              }, resSpotifyToken.expires_in * 1000);
            }),
            switchMap((resSpotifyToken: any) => {
              // Appel au endpoint de recherche Spotify pour une durée d'une heure
              this.albumsSpotifyDTO = this.makeSearchOnSpotify(words, resSpotifyToken.token_type + " " + resSpotifyToken.access_token);
              return this.albumsSpotifyDTO;
            })
          );
        }
        break;
    }
  }

  private handleErrorGetTmdbData(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue pendant le contact avec notre partenaire ciné TMDB !";
    if (!errorRes.error.status_code) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.status_code) {
      case 7:
        errorMessage = 'Clé API TMDB invalide, appel vers les services impossibles';
        break;
      case 34:
        errorMessage = 'Base de données TMDB non trouvée';
        break;
    }
    return throwError(errorMessage);
  }

  private removeTwitchTokenFromLS() {
    if (this.timerTwitchExpirToken) {
      localStorage.removeItem("twitchAccessToken");
      clearTimeout(this.timerTwitchExpirToken);
    }
    this.timerTwitchExpirToken = null;
  }

  private makeSearchOnIgdb(words: string, token: string): any {
    let gamesDTO: IgdbDTO[] = [];
    return this.httpClient
    .post(
      '/games',
      'fields name, release_dates.region, release_dates.m, release_dates.y, release_dates.platform, cover.url, cover.image_id, platforms.name;'
      + 'where name ~ *"' + words + '"* & release_dates.region = (1,8);'
      + 'limit 500;',
      {
        headers: {
          'Client-ID': environment.twitchAPIClientID,
          'Authorization': token.replace('bearer', 'Bearer')
        }
      }
    )
    .pipe(
      catchError(this.handleErrorGetIgdbData),
      map((resData: any) => {
        console.log("resData", resData);
        resData.filter(game => game.cover).forEach((game: any) => {
          game.platforms.forEach((platform: any) => {
            const idPlatform = platform.id;
            const namePlatform = platform.name;
            game.release_dates.forEach((releaseDate: any) => {
              if (releaseDate.platform == idPlatform && (releaseDate.region == 1 || releaseDate.region == 8)) {
                gamesDTO.push({
                  gameIgdbId: game.id,
                  gameTitle: game.name,
                  gameYear: releaseDate.y,
                  gamePosterUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/' + game.cover.image_id + '.jpg',
                  gamePlatform: namePlatform
                });
              }
            });
          });
        });
        return gamesDTO;
      })
    );
  }

  private handleErrorGetIgdbData(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue pendant le contact avec notre partenaire jeu IGDB !";
    console.log("ERREUR callback IGDB",errorRes);
    console.log("status",errorRes.status);
    switch (errorRes.status) {
      case 0:
        errorMessage = 'Erreur inconnue retournée par notre partenaire jeu IGDB';
        break;
      case 429:
        errorMessage = 'Quota de requêtes vers IGDB atteint (4 requêtes par seconde)';
        break;
    }
    return throwError(errorMessage);
  }

  private removeSpotifyTokenFromLS() {
    if (this.timerSpotifyExpirToken) {
      localStorage.removeItem("spotifyAccessToken");
      clearTimeout(this.timerSpotifyExpirToken);
    }
    this.timerSpotifyExpirToken = null;
  }

  private makeSearchOnSpotify(words: string, token: string): any {
    let albumsDTO: SpotifyDTO[] = [];
    console.log(token);
    return this.httpClient
    .get('/albums/search',
    {
      headers: {
        'Authorization': token
      },
      params: {
        'q': words,
        'type': 'album',
        'limit': '50'
      }
    })
    .pipe(
      catchError(this.handleErrorGetSpotifyData),
      map((resData: any) => {
        resData.albums.items.filter(album => album.images).forEach((album: any) => {
          albumsDTO.push({
            albumSpotifyId: album.id,
            albumArtist: album.artists[0].name,
            albumTitle: album.name,
            albumYear: album.release_date.substring(0,4),
            albumPosterUrl: album.images[1].url
          });
        });
        return albumsDTO;
      })
    );
  }

  private handleErrorGetSpotifyData(errorRes: HttpErrorResponse) {
    let errorMessage = "Une erreur est apparue pendant le contact avec notre partenaire musique Spotify !";
    console.log("ERREUR callback SPOTIFY",errorRes);
    console.log("message",errorRes.error.message);
    switch (errorRes.error.error.status) {
      case 400:
        errorMessage = errorRes.error.error.message;
        break;
      case 401:
        if (errorRes.error.error.message == "The access token expired") {
          errorMessage = "Le jeton Spotify a expiré, veuillez vous déconnecter/reconnecter au site Kult(u)r";
        }
        break;
    }
    return throwError(errorMessage);
  }

}
