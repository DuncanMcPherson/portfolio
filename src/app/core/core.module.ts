import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { FieldValidationComponent } from './components/field-validation/field-validation.component';



@NgModule({
    declarations: [
        HeaderComponent,
        FieldValidationComponent
    ],
    exports: [
        HeaderComponent
    ],
	imports: [
		CommonModule,
		RouterLink,
		RouterLinkActive
	]
})
export class CoreModule { }
