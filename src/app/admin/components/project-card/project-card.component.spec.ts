import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectCardComponent} from './project-card.component';
import {CoreModule} from "../../../core/core.module";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";

describe('ProjectCardComponent', () => {
	let component: ProjectCardComponent;
	let fixture: ComponentFixture<ProjectCardComponent>;

	beforeEach(async () => {
		let project = new ProjectBuilder().build();
		await TestBed.configureTestingModule({
			declarations: [ProjectCardComponent],
			imports: [CoreModule]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectCardComponent);
		component = fixture.componentInstance;
		component.project = project;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
