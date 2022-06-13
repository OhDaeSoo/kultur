import { MovieReview } from '../reviews-models/movie-review.model';
import { BookReview } from '../reviews-models/book-review.model';
import { GameReview } from '../reviews-models/game-review.model';
import { AlbumReview } from '../reviews-models/album-review.model';

export class User {
  email: string;
  pseudo: string;
  urlAvatar: string;
  desc: string;
  tabMovieReviews: MovieReview[];
  tabBookReviews: BookReview[];
  tabGameReviews: GameReview[];
  tabAlbumReviews: AlbumReview[];

  constructor(email: string,
    pseudo: string,
    urlAvatar: string,
    desc: string,
    tabMovieReviews?: any,
    tabBookReviews?: any,
    tabGameReviews?: any,
    tabAlbumReviews?: any) {
    this.email = email;
    this.pseudo = pseudo;
    this.urlAvatar = urlAvatar;
    this.desc = desc;
    this.tabMovieReviews = tabMovieReviews ? tabMovieReviews : [];
    this.tabBookReviews = tabBookReviews ? tabBookReviews : [];
    this.tabGameReviews = tabGameReviews ? tabGameReviews : [];
    this.tabAlbumReviews = tabAlbumReviews ? tabAlbumReviews : [];
  }
}
