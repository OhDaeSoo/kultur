import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { WebPartnersService, TmdbDTO, IgdbDTO, SpotifyDTO } from 'src/app/shared/services/web-partners.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private webPartnersService: WebPartnersService,
              private dataStorageService: DataStorageService,
              private authService: AuthService,
              private toastrService: ToastrService) { }

  // Types de critiques
  categories: any[] = [
    { cat: 'movie', title: 'Un film' },
    { cat: 'album', title: 'Un album' },
    { cat: 'book', title: 'Un livre' },
    { cat: 'game', title: 'Un jeu vidéo' }
  ];

  // Url poster categories block
  displayMovieInfosBlock: boolean = false;
  displayAlbumInfosBlock: boolean = false;
  displayBookInfosBlock: boolean = false;
  displayGameInfosBlock: boolean = false;

  // Formulaire par defaut : critique d'un film
  currentCategory: string = 'movie';
  // Notes de film
  movieScenarioNote: number = 0;
  movieDirectionNote: number = 0;
  movieActorsNote: number = 0;
  movieMusicNote: number = 0;
  movieSetsNote: number = 0;
  movieGlobalNote: number = 0;
  // Notes d'album
  albumAmbianceNote: number = 0;
  albumCompositionNote: number = 0;
  albumArrangementsNote: number = 0;
  albumTextsNote: number = 0;
  albumVocalsNote: number = 0;
  albumGlobalNote: number = 0;
  // Notes de jeu
  gameStoryNote: number = 0;
  gameCharactersNote: number = 0;
  gameMusicNote: number = 0;
  gameSetsNote: number = 0;
  gameRhythmNote: number = 0;
  gameTechnicalNote: number = 0;
  gameGlobalNote: number = 0;

  addReviewForm: FormGroup = this.fb.group({
    addReviewCategory: new FormControl('movie', Validators.required),
    addReviewDetails: new FormGroup({
      movieTmdbId: new FormControl('', Validators.required),
      movieTitle: new FormControl('', Validators.required),
      movieYear: new FormControl('', Validators.required),
      moviePosterUrl: new FormControl('', Validators.required),
      movieScenarioNote: new FormControl(0),
      movieDirectionNote: new FormControl(0),
      movieActorsNote: new FormControl(0),
      movieMusicNote: new FormControl(0),
      movieSetsNote: new FormControl(0),
      movieGlobalNote: new FormControl(0),
      movieReview: new FormControl('')
    })
  });

  // Booleens d'affichage addReviewForm (details)
  displayMovieDetails: boolean = true;
  displayAlbumDetails: boolean = false;
  displayBookDetails: boolean = false;
  displayGameDetails: boolean = false;

  // Labels btns
  labelBtnAddReview: string = 'Poster cette critique !';
  labelBtnReinit: string = 'Réinitialiser le formulaire';

  // Booleen & obj liste pour affichage des resultats retournes par appel REST
  isLoading: boolean = false;
  showResults: boolean = false;
  listMoviesRet: TmdbDTO[] = [];
  listGamesRet: IgdbDTO[] = [];
  listAlbumsRet: SpotifyDTO[] = [];

  ngOnInit(): void {}

  onSubmit() {
    this.dataStorageService.postDataForUserK(this.addReviewForm).subscribe(
      (resData: any) => {
        this.toastrService.success('Vous venez de faire entendre votre voix sur Kult(u)r', 'Félicitations !');
      },
      (errorObj: any) => {
        this.toastrService.error(errorObj.message, 'Problème');
        if(errorObj.code === 'ERR.Auth') {
          this.authService.logout();
        }
      }
    );
  }

  reinitForm() {
    switch(this.currentCategory) {
      case 'movie':
        this.movieScenarioNote = 0;
        this.movieDirectionNote = 0;
        this.movieActorsNote = 0;
        this.movieMusicNote = 0;
        this.movieSetsNote = 0;
        this.movieGlobalNote = 0;
        this.addReviewForm.setValue({
          addReviewCategory: 'movie',
          addReviewDetails: {
            movieTmdbId: '',
            movieTitle: '',
            movieYear: '',
            moviePosterUrl: '',
            movieScenarioNote: this.movieScenarioNote,
            movieDirectionNote: this.movieDirectionNote,
            movieActorsNote: this.movieActorsNote,
            movieMusicNote: this.movieMusicNote,
            movieSetsNote: this.movieSetsNote,
            movieGlobalNote: this.movieGlobalNote,
            movieReview: ''
          }
        });
        break;
      case 'album':
        this.albumAmbianceNote = 0;
        this.albumCompositionNote = 0;
        this.albumArrangementsNote = 0;
        this.albumTextsNote = 0;
        this.albumVocalsNote = 0;
        this.albumGlobalNote = 0;
        this.addReviewForm.setValue({
          addReviewCategory: 'album',
          addReviewDetails: {
            albumSpotifyId: '',
            albumTitle: '',
            albumArtist: '',
            albumYear: '',
            albumPosterUrl: '',
            albumAmbianceNote: this.albumAmbianceNote,
            albumCompositionNote: this.albumCompositionNote,
            albumArrangementsNote: this.albumArrangementsNote,
            albumTextsNote: this.albumTextsNote,
            albumVocalsNote: this.albumVocalsNote,
            albumGlobalNote: this.albumGlobalNote,
            albumReview: ''
          }
        });
        break;
      case 'game':
        this.gameStoryNote = 0;
        this.gameCharactersNote = 0;
        this.gameMusicNote = 0;
        this.gameSetsNote = 0;
        this.gameRhythmNote = 0;
        this.gameTechnicalNote = 0;
        this.gameGlobalNote = 0;
        this.addReviewForm.setValue({
          addReviewCategory: 'game',
          addReviewDetails: {
            gameIgdbId: '',
            gameTitle: '',
            gameYear: '',
            gamePlatform: '',
            gamePosterUrl: '',
            gameStoryNote: this.gameStoryNote,
            gameCharactersNote: this.gameCharactersNote,
            gameMusicNote: this.gameMusicNote,
            gameSetsNote: this.gameSetsNote,
            gameRhythmNote: this.gameRhythmNote,
            gameTechnicalNote: this.gameTechnicalNote,
            gameGlobalNote: this.gameGlobalNote,
            gameReview: ''
          }
        });
        break;
    }
    console.log("Formulaire reinitialise", this.addReviewForm);
  }

  buildAndDisplayCategoryForm(category: string) {
    this.currentCategory = category;
    this.addReviewForm.get('addReviewCategory').setValue(category);
    this.addReviewForm.removeControl('addReviewDetails');
    switch (category) {
      case 'movie':
        this.addReviewForm.addControl('addReviewDetails', new FormGroup({
          movieTmdbId: new FormControl('', Validators.required),
          movieTitle: new FormControl('', Validators.required),
          movieYear: new FormControl('', Validators.required),
          moviePosterUrl: new FormControl('', Validators.required),
          movieScenarioNote: new FormControl(0),
          movieDirectionNote: new FormControl(0),
          movieActorsNote: new FormControl(0),
          movieMusicNote: new FormControl(0),
          movieSetsNote: new FormControl(0),
          movieGlobalNote: new FormControl(0),
          movieReview: new FormControl('')
        }));
        this.displayMovieDetails = true;
        this.displayAlbumDetails = false;
        this.displayBookDetails = false;
        this.displayGameDetails = false;
        break;
      case 'album':
        this.addReviewForm.addControl('addReviewDetails', new FormGroup({
          albumSpotifyId: new FormControl('', Validators.required),
          albumTitle: new FormControl('', Validators.required),
          albumArtist: new FormControl('', Validators.required),
          albumYear: new FormControl('', Validators.required),
          albumPosterUrl: new FormControl('', Validators.required),
          albumAmbianceNote: new FormControl(0),
          albumCompositionNote: new FormControl(0),
          albumArrangementsNote: new FormControl(0),
          albumTextsNote: new FormControl(0),
          albumVocalsNote: new FormControl(0),
          albumGlobalNote: new FormControl(0),
          albumReview: new FormControl('')
        }));
        this.displayMovieDetails = false;
        this.displayAlbumDetails = true;
        this.displayBookDetails = false;
        this.displayGameDetails = false;
        break;
      case 'book':
        this.addReviewForm.addControl('addReviewDetails', new FormGroup({
          bookStoryNote: new FormControl(0),
          bookCharactersNote: new FormControl(0),
          bookFormatNote: new FormControl(0),
          bookGlobalNote: new FormControl(0),
          bookReview: new FormControl('')
        }));
        this.displayMovieDetails = false;
        this.displayAlbumDetails = false;
        this.displayBookDetails = true;
        this.displayGameDetails = false;
        break;
      case 'game':
        this.addReviewForm.addControl('addReviewDetails', new FormGroup({
          gameIgdbId: new FormControl('', Validators.required),
          gameTitle: new FormControl('', Validators.required),
          gameYear: new FormControl('', Validators.required),
          gamePosterUrl: new FormControl('', Validators.required),
          gamePlatform: new FormControl('', Validators.required),
          gameStoryNote: new FormControl(0),
          gameCharactersNote: new FormControl(0),
          gameMusicNote: new FormControl(0),
          gameSetsNote: new FormControl(0),
          gameRhythmNote: new FormControl(0),
          gameTechnicalNote: new FormControl(0),
          gameGlobalNote: new FormControl(0),
          gameReview: new FormControl('')
        }));
        this.displayMovieDetails = false;
        this.displayAlbumDetails = false;
        this.displayBookDetails = false;
        this.displayGameDetails = true;
        break;
    }
  }

  displayNoteAndComputeTotalNote(event: any, category: string, divId: string) {
    switch(category) {
      case 'movie':
        switch(divId) {
          case 'movieScenarioNote':
            this.movieScenarioNote = event.value;
            break;
          case 'movieDirectionNote':
            this.movieDirectionNote = event.value;
            break;
          case 'movieActorsNote':
            this.movieActorsNote = event.value;
            break;
          case 'movieMusicNote':
            this.movieMusicNote = event.value;
            break;
          case 'movieSetsNote':
            this.movieSetsNote = event.value;
            break;
        }
        this.movieGlobalNote = (this.movieScenarioNote
          +this.movieDirectionNote
          +this.movieActorsNote
          +this.movieMusicNote
          +this.movieSetsNote)/5;
        this.addReviewForm.get('addReviewDetails').get('movieGlobalNote').setValue(this.movieGlobalNote);
        break;

      case 'album':
          switch(divId) {
            case 'albumAmbianceNote':
              this.albumAmbianceNote = event.value;
              break;
            case 'albumCompositionNote':
              this.albumCompositionNote = event.value;
              break;
            case 'albumArrangementsNote':
              this.albumArrangementsNote = event.value;
              break;
            case 'albumTextsNote':
              this.albumTextsNote = event.value;
              break;
            case 'albumVocalsNote':
              this.albumVocalsNote = event.value;
              break;
          }
          this.albumGlobalNote = (this.albumAmbianceNote
            +this.albumCompositionNote
            +this.albumArrangementsNote
            +this.albumTextsNote
            +this.albumVocalsNote)/5;
          this.addReviewForm.get('addReviewDetails').get('albumGlobalNote').setValue(this.albumGlobalNote);
          break;

      case 'game':
        switch(divId) {
          case 'gameStoryNote':
            this.gameStoryNote = event.value;
            break;
          case 'gameCharactersNote':
            this.gameCharactersNote = event.value;
            break;
          case 'gameMusicNote':
            this.gameMusicNote = event.value;
            break;
          case 'gameSetsNote':
            this.gameSetsNote = event.value;
            break;
          case 'gameRhythmNote':
            this.gameRhythmNote = event.value;
            break;
          case 'gameTechnicalNote':
            this.gameTechnicalNote = event.value;
            break;
        }
        this.gameGlobalNote = +((this.gameStoryNote
          +this.gameCharactersNote
          +this.gameMusicNote
          +this.gameSetsNote
          +this.gameRhythmNote
          +this.gameTechnicalNote)/6).toFixed(1);
        this.addReviewForm.get('addReviewDetails').get('gameGlobalNote').setValue(this.gameGlobalNote);
        break;
    }
  }

  onTypingRef(event: any, category: string) {
    if (this.addReviewForm.get('addReviewDetails').get(`${category}Title`).value === '') {
      this.showResults = false;
    }
  }

  onSearch(words: string, category: string) {
    this.isLoading = true;
    this.webPartnersService.searchMediaInfos(words, category).subscribe(
      (resData: any[]) => {
        this.isLoading = false;
        if (category == 'movie') {
          this.listMoviesRet = resData;
        } else if (category == 'album') {
          this.listAlbumsRet = resData;
          console.log("albums",this.listAlbumsRet);
        } else if (category == 'game') {
          this.listGamesRet = resData;
        }
        this.showResults = true;
      },
      (errorRes: string) => {
        this.isLoading = false;
        this.toastrService.error(errorRes, 'Problème');
      }
    );
  }

  treatElement(event: any) {
    this.showResults = false;
    switch(this.currentCategory) {
      case 'movie':
        this.addReviewForm.get('addReviewDetails').get('movieTmdbId').setValue(event.movieTmdbId);
        this.addReviewForm.get('addReviewDetails').get('movieTitle').setValue(event.movieTitle);
        this.addReviewForm.get('addReviewDetails').get('movieYear').setValue(event.movieYear);
        this.addReviewForm.get('addReviewDetails').get('moviePosterUrl').setValue(event.moviePosterUrl);
        break;
      case 'album':
        this.addReviewForm.get('addReviewDetails').get('albumSpotifyId').setValue(event.albumSpotifyId);
        this.addReviewForm.get('addReviewDetails').get('albumTitle').setValue(event.albumTitle);
        this.addReviewForm.get('addReviewDetails').get('albumArtist').setValue(event.albumArtist);
        this.addReviewForm.get('addReviewDetails').get('albumYear').setValue(event.albumYear);
        this.addReviewForm.get('addReviewDetails').get('albumPosterUrl').setValue(event.albumPosterUrl);
        break;
      case 'game':
        this.addReviewForm.get('addReviewDetails').get('gameIgdbId').setValue(event.gameIgdbId);
        this.addReviewForm.get('addReviewDetails').get('gameTitle').setValue(event.gameTitle);
        this.addReviewForm.get('addReviewDetails').get('gameYear').setValue(event.gameYear);
        this.addReviewForm.get('addReviewDetails').get('gamePosterUrl').setValue(event.gamePosterUrl);
        this.addReviewForm.get('addReviewDetails').get('gamePlatform').setValue(event.gamePlatform);
        break;
    }
  }

}
