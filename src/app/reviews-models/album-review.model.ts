// Model d'une revue d'album
////////////////////////////
export class AlbumReview {
  albumSpotifyId: string; // Id spotify de l'album
  albumTitle: string; // Titre de l'album
  albumArtist: string; // Artiste de l'album
  albumYear: string; // Annee de sortie de l'album
  albumPosterUrl: string; // Url de l'affiche de l'album
  albumAmbianceNote: number; // Note sur 5 de l'univers, ambiance
  albumCompositionNote: number; // Note sur 5 de la qualite des compositions
  albumArrangementsNote: number; // Note sur 5 des arrangements
  albumTextsNote: number; // Note sur 5 des textes
  albumVocalsNote: number; // Note sur 5 des voix
  albumGlobalNote: number; // Note globale sur 5
  albumReview: string; // Revue de l'album par l'utilisateur
  albumReviewDate: string; // Date de la revue (creation, derniere mise a jour)

  constructor(albumSpotifyId: string,
    albumTitle: string,
    albumArtist: string,
    albumYear: string,
    albumPosterUrl: string,
    albumAmbianceNote: number,
    albumCompositionNote: number,
    albumArrangementsNote: number,
    albumTextsNote: number,
    albumVocalsNote: number,
    albumGlobalNote: number,
    albumReview: string,
    albumReviewDate: string) {
    this.albumSpotifyId = albumSpotifyId;
    this.albumTitle = albumTitle;
    this.albumArtist = albumArtist;
    this.albumYear = albumYear;
    this.albumPosterUrl = albumPosterUrl;
    this.albumAmbianceNote = albumAmbianceNote;
    this.albumCompositionNote = albumCompositionNote;
    this.albumArrangementsNote = albumArrangementsNote;
    this.albumTextsNote = albumTextsNote;
    this.albumVocalsNote = albumVocalsNote;
    this.albumGlobalNote = albumGlobalNote;
    this.albumReview = albumReview;
    this.albumReviewDate = albumReviewDate;
  }
}
