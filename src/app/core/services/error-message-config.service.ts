import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ErrorMessageConfigService {
	public static readonly DO_NOT_SHOW_ANY_ERROR_MESSAGE: string =
		"Let the field be invalid, but don’t show any error message";

}
