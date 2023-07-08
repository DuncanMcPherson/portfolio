import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateProjectModalComponent} from './create-project-modal.component';
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {CoreModule} from "../../../core/core.module";
import {ReactiveFormsModule} from "@angular/forms";
import * as Chance from 'chance';
import {PreviewBuilder} from "../../../../test-utils/builders/preview.builder";
const chance = new Chance();

describe('CreateProjectModalComponent', () => {
	let component: CreateProjectModalComponent;
	let fixture: ComponentFixture<CreateProjectModalComponent>;

	let linkPreviewServiceMock: LinkPreviewService;

	beforeEach(async () => {
		linkPreviewServiceMock = autoMockerInstance.mockClass(LinkPreviewService);
		await TestBed.configureTestingModule({
			declarations: [CreateProjectModalComponent],
			providers: [
				{
					provide: LinkPreviewService,
					useValue: linkPreviewServiceMock
				}
			],
			imports: [
				CoreModule,
				ReactiveFormsModule
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(CreateProjectModalComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should initialize form', () => {
			expect(component.form).toBeFalsy();

			fixture.detectChanges();

			expect(component.form).toBeTruthy();
		});
	});
});
