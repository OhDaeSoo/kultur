import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../../user/user.model';
import { UserSession } from '../../user/user-session.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private httpClient: HttpClient,
              private router: Router) {}

  postDataForUserK(form: FormGroup) {
    const curUserK: User = JSON.parse(localStorage.getItem('userKultur'));
    const userKpseudo = curUserK.pseudo;
    const curUserSession: UserSession = JSON.parse(localStorage.getItem('userSession'));
    const idToken: string = curUserSession.idToken;
    let bodyToPost: any;
    let urlTabCategory: string;
    switch (form.get('addReviewCategory').value) {
      case 'movie':
        urlTabCategory = 'tabMovieReviews';
        bodyToPost = {
          movieTmdbId: form.get('addReviewDetails').get('movieTmdbId').value,
          movieTitle: form.get('addReviewDetails').get('movieTitle').value,
          movieYear: form.get('addReviewDetails').get('movieYear').value,
          moviePosterUrl: form.get('addReviewDetails').get('moviePosterUrl').value,
          movieScenarioNote: form.get('addReviewDetails').get('movieScenarioNote').value,
          movieDirectionNote: form.get('addReviewDetails').get('movieDirectionNote').value,
          movieActorsNote: form.get('addReviewDetails').get('movieActorsNote').value,
          movieMusicNote: form.get('addReviewDetails').get('movieMusicNote').value,
          movieSetsNote: form.get('addReviewDetails').get('movieSetsNote').value,
          movieGlobalNote: form.get('addReviewDetails').get('movieGlobalNote').value,
          movieReview: form.get('addReviewDetails').get('movieReview').value,
          movieReviewDate: new Date().toISOString().slice(0,10)
        };
        break;
      case 'game':
        urlTabCategory = 'tabGameReviews';
        bodyToPost = {
          gameIgdbId: form.get('addReviewDetails').get('gameIgdbId').value,
          gameTitle: form.get('addReviewDetails').get('gameTitle').value,
          gameYear: form.get('addReviewDetails').get('gameYear').value,
          gamePlatform: form.get('addReviewDetails').get('gamePlatform').value,
          gamePosterUrl: form.get('addReviewDetails').get('gamePosterUrl').value,
          gameStoryNote: form.get('addReviewDetails').get('gameStoryNote').value,
          gameCharactersNote: form.get('addReviewDetails').get('gameCharactersNote').value,
          gameMusicNote: form.get('addReviewDetails').get('gameMusicNote').value,
          gameSetsNote: form.get('addReviewDetails').get('gameSetsNote').value,
          gameRhythmNote: form.get('addReviewDetails').get('gameRhythmNote').value,
          gameTechnicalNote: form.get('addReviewDetails').get('gameTechnicalNote').value,
          gameGlobalNote: form.get('addReviewDetails').get('gameGlobalNote').value,
          gameReview: form.get('addReviewDetails').get('gameReview').value,
          gameReviewDate: new Date().toISOString().slice(0,10)
        };
        break;
      case 'album':
        urlTabCategory = 'tabAlbumReviews';
        bodyToPost = {
          albumSpotifyId: form.get('addReviewDetails').get('albumSpotifyId').value,
          albumTitle: form.get('addReviewDetails').get('albumTitle').value,
          albumArtist: form.get('addReviewDetails').get('albumArtist').value,
          albumYear: form.get('addReviewDetails').get('albumYear').value,
          albumPosterUrl: form.get('addReviewDetails').get('albumPosterUrl').value,
          albumAmbianceNote: form.get('addReviewDetails').get('albumAmbianceNote').value,
          albumCompositionNote: form.get('addReviewDetails').get('albumCompositionNote').value,
          albumArrangementsNote: form.get('addReviewDetails').get('albumArrangementsNote').value,
          albumTextsNote: form.get('addReviewDetails').get('albumTextsNote').value,
          albumVocalsNote: form.get('addReviewDetails').get('albumVocalsNote').value,
          albumGlobalNote: form.get('addReviewDetails').get('albumGlobalNote').value,
          albumReview: form.get('addReviewDetails').get('albumReview').value,
          albumReviewDate: new Date().toISOString().slice(0,10)
        };
        break;
    }
    return this.httpClient
    .post(
      'https://mon-app-kultur.firebaseio.com/users/' + userKpseudo + '/' + urlTabCategory + '.json',
      bodyToPost,
      {
        params: {
          'auth': idToken
        }
      }
    ).pipe(
      catchError(this.handleErrorPostDataForUserK),
      tap(() => {
        this.router.navigate(['']);
      })
    )
  }

  private handleErrorPostDataForUserK(errorRes: HttpErrorResponse) {
    let errorObj = {
      code: 'ERR.std',
      message: 'Une erreur est survenue'
    };
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorObj);
    }
    switch (errorRes.error.error) {
      case 'Auth token is expired':
        errorObj = {
          code: 'ERR.Auth',
          message: 'Le jeton d\'authentification Firebase a expiré. Veuillez vous reconnecter à Kult(u)r et saisir à nouveau votre critique.'
        };
        break;
    }
    return throwError(errorObj);
  }

}
