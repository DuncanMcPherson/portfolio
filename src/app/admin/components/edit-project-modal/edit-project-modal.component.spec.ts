import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditProjectModalComponent} from './edit-project-modal.component';
import {IProject} from "../../../projects/models/project.model";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";
import {CoreModule} from "../../../core/core.module";
import {ReactiveFormsModule} from "@angular/forms";

describe('EditProjectModalComponent', () => {
	let component: EditProjectModalComponent;
	let fixture: ComponentFixture<EditProjectModalComponent>;
	let project: IProject;

	beforeEach(async () => {
	  	project = new ProjectBuilder().build();
		await TestBed.configureTestingModule({
			declarations: [EditProjectModalComponent],
			imports: [
				CoreModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(EditProjectModalComponent);
		component = fixture.componentInstance;
		component.project = project;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
