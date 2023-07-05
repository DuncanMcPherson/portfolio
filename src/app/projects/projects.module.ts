import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProjectsHomeComponent} from './components/projects-home/projects-home.component';
import {PublicProjectCardComponent} from './components/public-project-card/public-project-card.component';
import {CoreModule} from "../core/core.module";
import {ProjectDetailsComponent} from './components/project-details/project-details.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: ProjectsHomeComponent
	},
	{
		path: ':id',
		component: ProjectDetailsComponent
	}
]

@NgModule({
	declarations: [
		ProjectsHomeComponent,
		PublicProjectCardComponent,
		ProjectDetailsComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		CoreModule,
		NgOptimizedImage
	]
})
export class ProjectsModule {
}
