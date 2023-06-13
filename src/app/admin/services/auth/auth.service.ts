import {Injectable} from '@angular/core';
import {Auth, getAuth, signInWithEmailAndPassword, User, onAuthStateChanged} from 'firebase/auth'
import {AppService} from "../../../core/services/app/app.service";
import {BehaviorSubject, from, map, Observable} from "rxjs";
import {AdminModule} from "../../admin.module";

@Injectable({
	providedIn: AdminModule
})
export class AuthService {
	private user$$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	public user$: Observable<User> = this.user$$.asObservable();

	private _auth: Auth;
	private allowedAdmins: string[] = [
		'd.mcpherson.home@gmail.com'
	]

	private set auth(value: Auth) {
		this._auth = value;
	}

	private get auth(): Auth {
		return this._auth;
	}

	constructor(
		private readonly appService: AppService
	) {
		this.auth = getAuth(appService.app);

		onAuthStateChanged(this.auth, (user) => {
			if (this.allowedAdmins.includes(user.email)) {
				this.user$$.next(user);
			}
		})
	}

	public signInWithEmailAndPassword(email: string, password: string): Observable<void> {
		return from(signInWithEmailAndPassword(this.auth, email, password))
			.pipe(
				map((userCred) => {
					if (userCred && this.allowedAdmins.includes(userCred.user.email)) {
						console.log('Welcome Back!')
					}
				})
			);
	}
}
