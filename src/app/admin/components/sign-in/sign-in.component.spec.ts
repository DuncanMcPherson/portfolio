import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignInComponent} from './sign-in.component';
import {CoreModule} from "../../../core/core.module";
import {AuthService} from "../../services/auth/auth.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {ReactiveFormsModule} from "@angular/forms";

import * as Chance from 'chance';
import {Router} from "@angular/router";
const chance = new Chance();

describe('SignInComponent', () => {
	let component: SignInComponent;
	let fixture: ComponentFixture<SignInComponent>;
	let authServiceMock: AuthService;
	let routerMock: Router;

	beforeEach(async () => {
		authServiceMock = autoMockerInstance.mockClass(AuthService);
		routerMock = autoMockerInstance.mockClass(Router)
		await TestBed.configureTestingModule({
			declarations: [SignInComponent],
			imports: [
				CoreModule,
				ReactiveFormsModule
			],
			providers: [
				{
					provide: AuthService,
					useValue: authServiceMock
				},
				{
					provide: Router,
					useValue: routerMock
				}
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(SignInComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form', () => {
		expect(component.form).toBeTruthy();
	});

	describe('submit', () => {
		it('should not call authService.signInWithEmailAndPassword when form is not valid', () => {
			component.submit();

			expect(authServiceMock.signInWithEmailAndPassword).not.toHaveBeenCalled();
		});

		it('should call signInWithEmailAndPassword and router.navigate on sign in success', () => {
			const formValue = {
				email: chance.email(),
				password: chance.string()
			};
			component.form.setValue(formValue);
			autoMockerInstance.withReturnObservable(authServiceMock.signInWithEmailAndPassword);

			component.submit();

			expect(authServiceMock.signInWithEmailAndPassword).toHaveBeenCalledWith(formValue.email, formValue.password);
			expect(routerMock.navigate).toHaveBeenCalledWith(['admin']);
		});

		it('should call signInWithEmailAndPassword but not router.navigate on sign in fail', () => {
			const formValue = {
				email: chance.email(),
				password: chance.string()
			};
			component.form.setValue(formValue);
			autoMockerInstance.withReturnSubjectWithErrorAsObservable(authServiceMock.signInWithEmailAndPassword);

			component.submit();

			expect(authServiceMock.signInWithEmailAndPassword).toHaveBeenCalled();
			expect(routerMock.navigate).not.toHaveBeenCalled();
			expect(component.error).toBeTruthy();
		})
	})
});
