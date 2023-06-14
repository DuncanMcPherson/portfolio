import { User } from 'firebase/auth';
import * as Chance from 'chance';
const chance = new Chance();

export class UserBuilder {
	private _email: string = chance.email();

	public withEmail(email: string): UserBuilder {
		this._email = email;
		return this;
	}

	public build(): User {
		return {
			email: this._email
		} as User;
	}
}
