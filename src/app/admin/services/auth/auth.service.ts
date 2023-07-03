import {Injectable} from '@angular/core';
import {Auth, getAuth, signInWithEmailAndPassword, User, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'firebase/auth'
import {AppService} from "../../../core/services/app/app.service";
import {from, map, Observable, shareReplay, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private user$$: Subject<User> = new Subject();
	public user$: Observable<User> = this.user$$.asObservable().pipe(
		shareReplay(1)
	);

	private _auth: Auth;
	private allowedAdmins: string[] = [
		'd.mcpherson.home@gmail.com'
	]

	private set auth(value: Auth) {
		this._auth = value;
		void setPersistence(value, browserLocalPersistence);
	}

	private get auth(): Auth {
		return this._auth;
	}

	constructor(
		private readonly appService: AppService
	) {
		this.auth = getAuth(appService.app);

		onAuthStateChanged(this.auth, (user) => {
			if (user && this.allowedAdmins.includes(user.email)) {
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
