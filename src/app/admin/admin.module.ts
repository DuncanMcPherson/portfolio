import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import {AuthGuard} from "./guards/auth.guard";
import {ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../core/core.module";
import { ProjectsManagementComponent } from './components/projects-management/projects-management.component';
import { CreateProjectModalComponent } from './components/create-project-modal/create-project-modal.component';

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
	},
	{
		path: 'projects',
		component: ProjectsManagementComponent,
		canActivate: [AuthGuard]
	}
]

@NgModule({
	declarations: [
    SignInComponent,
    AdminPortalComponent,
    ProjectsManagementComponent,
    CreateProjectModalComponent
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
