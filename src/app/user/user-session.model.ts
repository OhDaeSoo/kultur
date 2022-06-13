export class UserSession {
  constructor(
      public email: string,
      public localId: string,
      public idToken: string,
      public tokenExpirationDate: Date
  ) {}

  get token() { // getter : permet de renvoyer la valeur de idToken en faisant user.token
      if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
          return null; // On retourne aucun token, si celui-ci est inexistant ou expiré
      }
      return this.idToken;
  }
}
