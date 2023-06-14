import {TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {AuthService} from "../services/auth/auth.service";
import {autoMockerInstance} from "../../../test-utils/auto-mocker-plus";
import {UserBuilder} from "../../../test-utils/builders/user.builder";
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let authServiceMock: AuthService;

	beforeEach(() => {
		authServiceMock = autoMockerInstance.mockClass(AuthService);
		TestBed.configureTestingModule({
			providers: [
				{
					provide: AuthService,
					useValue: authServiceMock
				},
				RouterTestingModule,
				AuthGuard,
			]
		});
		guard = TestBed.inject(AuthGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	describe('canActivate', () => {
		it('should return urlTree when invalid email passed', (done) => {
			const user = new UserBuilder().build();
			autoMockerInstance.withReturnSubjectForObservableProperty(authServiceMock, 'user$', user);

			guard.canActivate(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot)
				.subscribe({
					next: (result) => {
						expect(result instanceof UrlTree).toBeTrue();
						done();
					}
				});
		});

		it('should return urlTree when no user returned', (done) => {
			autoMockerInstance.withReturnSubjectForObservableProperty(authServiceMock, 'user$', null);

			guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
				.subscribe({
					next: (result) => {
						expect(result instanceof UrlTree).toBeTrue();
						done();
					}
				});
		});

		it('should return true when email is valid', (done) => {
			const user = new UserBuilder().withEmail('d.mcpherson.home@gmail.com').build();
			autoMockerInstance.withReturnSubjectForObservableProperty(authServiceMock, 'user$', user);

			guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
				.subscribe((result) => {
					expect(typeof result === 'boolean').toBeTrue();
					expect(result).toBeTrue();
					done();
				})
		})
	})
});
