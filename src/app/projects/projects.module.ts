import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProjectsHomeComponent} from './components/projects-home/projects-home.component';
import {PublicProjectCardComponent} from './components/public-project-card/public-project-card.component';
import {CoreModule} from "../core/core.module";

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: ProjectsHomeComponent
	}
]

@NgModule({
	declarations: [
		ProjectsHomeComponent,
		PublicProjectCardComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		CoreModule
	]
})
export class ProjectsModule {
}
