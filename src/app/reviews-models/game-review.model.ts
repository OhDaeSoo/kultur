// Model d'une revue d'un Jeu-Video
///////////////////////////////////
export class GameReview {
  gameIgdbId: string; // Identifiant IGDB du jeu
  gameTitle: string; // Titre du jeu
  gameYear: string; // Annee de sortie du jeu
  gamePlatform: string; // Plateforme sur laquelle le jeu a été revu
  gamePosterUrl: string; // Url de l'affiche du jeu
  gameStoryNote: number; // Note sur 5 de l'histoire
  gameCharactersNote: number; // Note sur 5 des personnages
  gameMusicNote: number; // Note sur 5 de la musique
  gameSetsNote: number; // Note sur 5 des decors
  gameRhythmNote: number; // Note sur 5 du rythme
  gameTechnicalNote: number; // Note sur 5 concernant la réalisation, le framerate et les bugs rencontrés
  gameGlobalNote: number; // Note globale sur 5
  gameReview: string; // Revue du jeu par l'utilisateur
  gameReviewDate: string; // Date de la revue (creation, derniere mise a jour)

  constructor(gameIgdbId: string,
    gameTitle: string,
    gameYear: string,
    gamePlatform: string,
    gamePosterUrl: string,
    gameStoryNote: number,
    gameCharactersNote: number,
    gameMusicNote: number,
    gameSetsNote: number,
    gameRhythmNote: number,
    gameTechnicalNote: number,
    gameGlobalNote: number,
    gameReview: string,
    gameReviewDate: string) {
    this.gameIgdbId = gameIgdbId;
    this.gameTitle = gameTitle;
    this.gameYear = gameYear;
    this.gamePlatform = gamePlatform;
    this.gamePosterUrl = gamePosterUrl;
    this.gameStoryNote = gameStoryNote;
    this.gameCharactersNote = gameCharactersNote;
    this.gameMusicNote = gameMusicNote;
    this.gameSetsNote = gameSetsNote;
    this.gameRhythmNote = gameRhythmNote;
    this.gameTechnicalNote = gameTechnicalNote;
    this.gameGlobalNote = gameGlobalNote;
    this.gameReview = gameReview;
    this.gameReviewDate = gameReviewDate;
  }
}
