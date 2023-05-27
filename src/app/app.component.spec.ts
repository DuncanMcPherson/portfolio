import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";

describe('AppComponent', () => {
	let fixture: ComponentFixture<AppComponent>;
	let component: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				CoreModule
			],
			declarations: [
				AppComponent
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it(`should have as title 'JDMBlog'`, () => {
		expect(component.title).toEqual('JDMBlog');
	});
});
