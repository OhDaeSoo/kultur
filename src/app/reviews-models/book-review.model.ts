// Model d'une revue de Livre
/////////////////////////////
export class BookReview {
  bookTitle: string; // Titre du livre
  bookPosterUrl: string; // Url de l'affiche du livre
  bookStoryNote: number; // Note sur 5 de l'histoire
  bookCharactersNote: number; // Note sur 5 des personnages
  bookFormatNote: number; // Note sur 5 de la forme: mise en page, qualite d'expression et orthographe
  bookGlobalNote: number; // Note globale sur 5
  bookReview: string; // Revue du Livre par l'utilisateur
  bookReviewDate: string; // Date de la revue (creation, derniere mise a jour)

  constructor(bookTitle: string,
    bookPosterUrl: string,
    bookStoryNote: number,
    bookCharactersNote: number,
    bookFormatNote: number,
    bookGlobalNote: number,
    bookReview: string,
    bookReviewDate: string) {
    this.bookTitle = bookTitle;
    this.bookPosterUrl = bookPosterUrl;
    this.bookStoryNote = bookStoryNote;
    this.bookCharactersNote = bookCharactersNote;
    this.bookFormatNote = bookFormatNote;
    this.bookGlobalNote = bookGlobalNote;
    this.bookReview = bookReview;
    this.bookReviewDate = bookReviewDate;
  }
}
