import {Injectable} from '@angular/core';
import {IErrorMessages} from "../models/error-message.model";

@Injectable({
	providedIn: 'root'
})
export class ErrorMessageConfigService {
	public static readonly DO_NOT_SHOW_ANY_ERROR_MESSAGE: string =
		"Let the field be invalid, but don’t show any error message";

	public signInEmail: IErrorMessages = {
		required: 'Please enter your email',
		email: 'Please enter a valid email'
	};

	public signInPassword: IErrorMessages = {
		required: 'Please enter your password'
	}

	public projectTitle: IErrorMessages = {
		required: 'Please specify the title of the project.',
		minlength: 'Title must be at least 5 characters in length.'
	}

	public projectUrl: IErrorMessages = {
		required: 'Please specify the url for the project',
		notAUrl: 'Please enter the url in the format of https:// or http://'
	}

	public projectDescription: IErrorMessages = {
		minlength: 'Please enter a minimum of 45 characters.'
	}
}
