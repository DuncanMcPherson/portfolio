import {Injectable} from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {FirebaseApp, initializeApp} from "firebase/app";

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private readonly _app: FirebaseApp;

	public get app(): FirebaseApp {
		return this._app;
	}

	constructor(
		private readonly environmentService: EnvironmentService
	) {
		this._app = initializeApp(this.environmentService.firebaseConfig);
	}
}
