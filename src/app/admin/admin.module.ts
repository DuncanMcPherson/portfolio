import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import {AuthGuard} from "./guards/auth.guard";
import {ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../core/core.module";

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: AdminPortalComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'auth',
		component: SignInComponent,
	}
]

@NgModule({
	declarations: [
    SignInComponent,
    AdminPortalComponent
  ],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		CoreModule
	]
})
export class AdminModule {
}
