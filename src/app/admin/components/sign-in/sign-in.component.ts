import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

interface ISignInForm {
	email: FormControl<string>,
	password: FormControl<string>
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
	public form: FormGroup<ISignInForm>;
	public error: string;

	public get emailControl(): FormControl {
		return this.form.get('email') as FormControl;
	}

	public get passwordControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	constructor(
		private readonly authService: AuthService,
		private readonly router: Router
	) {}

	public ngOnInit(): void {
		this.form = new FormGroup<ISignInForm>({
			email: new FormControl<string>('', [Validators.required, Validators.email]),
			password: new FormControl<string>('', [Validators.required])
		});
	}

	public submit(): void {
		this.error = null;
		if (!this.form.valid) {
			return;
		}

		const formValue = this.form.value;

		this.authService.signInWithEmailAndPassword(formValue.email, formValue.password)
			.subscribe({
				next: () => {
					void this.router.navigate(['admin'])
				},
				error: () => {
					this.error = 'It appears that you do not have permission to access this page. Please return to the main page.'
				}
			})
	}

	public isButtonDisabled(): boolean {
		return !this.form.valid;
	}
}
