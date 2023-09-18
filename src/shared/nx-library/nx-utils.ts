import * as bcryptjs from "bcryptjs";
import * as JWT from "jsonwebtoken";
import { APP_ENUM } from "../enums/app.enum";

class NxUtils {
  getRandomLetter(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getRandomNumber(length: number): string {
    let text = "";
    const possible = "0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  generateRandomPassword(length: number = 8) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    var password = "";

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  generateUniqueId(digit: number = 10): string {
    let uniqueId: string = "";
    switch (digit) {
      case 4:
        uniqueId = this.getRandomNumber(4);
        break;

      case 6:
        uniqueId = this.getRandomLetter(2) + this.getRandomNumber(4);
        break;

      case 8:
        uniqueId = this.getRandomLetter(2) + this.getRandomNumber(4) + this.getRandomLetter(2);
        break;

      case 10:
        uniqueId = this.getRandomLetter(2) + this.getRandomNumber(4) + this.getRandomLetter(2) + this.getRandomNumber(2);
        break;
    }
    return uniqueId;
  }
}
export default new NxUtils();
