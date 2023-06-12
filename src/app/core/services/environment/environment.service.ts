import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
	public get firebaseConfig() {
		return environment.firebaseInit;
	}

	public get recaptchaKey() {
		return environment.recaptchaKey;
	}

	public get linkPreviewKey(): string {
		return environment.linkPreviewKey;
	}

	public get linkPreviewApi(): string {
		return 'https://api.linkpreview.net';
	}
}
