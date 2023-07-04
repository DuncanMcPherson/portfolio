// TODO: Unit tests
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicProjectCardComponent} from './public-project-card.component';
import {CoreModule} from "../../../core/core.module";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";

describe('PublicProjectCardComponent', () => {
	let component: PublicProjectCardComponent;
	let fixture: ComponentFixture<PublicProjectCardComponent>;

	beforeEach(async () => {
		let project = new ProjectBuilder().build();
		await TestBed.configureTestingModule({
			declarations: [PublicProjectCardComponent],
			imports: [
				CoreModule
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(PublicProjectCardComponent);
		component = fixture.componentInstance;
		component.project = project;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
