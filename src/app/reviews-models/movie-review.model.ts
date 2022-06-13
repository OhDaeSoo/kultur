// Model d'une revue de Film
////////////////////////////
export class MovieReview {
  movieTmdbId: string; // Identifiant TMDB du film
  movieTitle: string; // Titre du film
  movieYear: string; // Annee de sortie du film
  moviePosterUrl: string; // Url de l'affiche du film
  movieScenarioNote: number; // Note sur 5 du scenario
  movieDirectionNote: number; // Note sur 5 de la mise en scene
  movieActorsNote: number; // Note sur 5 de la performance des acteurs
  movieMusicNote: number; // Note sur 5 de la musique
  movieSetsNote: number; // Note sur 5 des decors
  movieGlobalNote: number; // Note globale sur 5
  movieReview: string; // Revue du film par l'utilisateur
  movieReviewDate: string; // Date de la revue (creation, derniere mise a jour)

  constructor(movieTmdbId: string,
    movieTitle: string,
    movieYear: string,
    moviePosterUrl: string,
    movieScenarioNote: number,
    movieDirectionNote: number,
    movieActorsNote: number,
    movieMusicNote: number,
    movieSetsNote: number,
    movieGlobalNote: number,
    movieReview: string,
    movieReviewDate: string) {
    this.movieTmdbId = movieTmdbId;
    this.movieTitle = movieTitle;
    this.movieYear = movieYear;
    this.moviePosterUrl = moviePosterUrl;
    this.movieScenarioNote = movieScenarioNote;
    this.movieDirectionNote = movieDirectionNote;
    this.movieActorsNote = movieActorsNote;
    this.movieMusicNote = movieMusicNote;
    this.movieSetsNote = movieSetsNote;
    this.movieGlobalNote = movieGlobalNote;
    this.movieReview = movieReview;
    this.movieReviewDate = movieReviewDate;
  }
}
