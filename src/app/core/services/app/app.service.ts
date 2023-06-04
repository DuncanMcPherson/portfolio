import {Injectable} from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {FirebaseApp, initializeApp} from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check"

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private _app?: FirebaseApp;
	private _appCheck?: AppCheck;

	public get app(): FirebaseApp {
		return this._app as FirebaseApp;
	}

	private set app(value: FirebaseApp) {
		this._app = value;
		this.initializeAppCheck(value);
	}

	private set appCheck(value: AppCheck) {
		this._appCheck = value;
	}

	constructor(
		private readonly environmentService: EnvironmentService
	) {
		this.app = initializeApp(this.environmentService.firebaseConfig);
	}

	private initializeAppCheck(app: FirebaseApp) {
		this.appCheck = initializeAppCheck(app, {
			provider: new ReCaptchaV3Provider(this.environmentService.recaptchaKey),
			isTokenAutoRefreshEnabled: true
		})
	}
}
