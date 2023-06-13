import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {AuthService} from "../services/auth/auth.service";
import {AdminModule} from "../admin.module";

@Injectable({
	providedIn: AdminModule
})
export class AuthGuard implements CanActivate {

	constructor(
		private readonly router: Router,
		private readonly authService: AuthService
	) {
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.authService.user$
			.pipe(
				take(1),
				map((user) => {
					if (user && user.email === 'd.mcpherson.home@gmail.com') {
						return true;
					}
					return this.router.createUrlTree(['admin', 'auth'])
				})
			);
	}

}
