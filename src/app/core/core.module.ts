import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { FieldValidationComponent } from './components/field-validation/field-validation.component';
import { CustomCheckboxComponent } from './components/custom-checkbox/custom-checkbox.component';
import { AnimatedLabelDirective } from './directives/animated-label.directive';
import {ModalModule} from "ngx-bootstrap/modal";



@NgModule({
    declarations: [
        HeaderComponent,
        FieldValidationComponent,
        CustomCheckboxComponent,
        AnimatedLabelDirective
    ],
    exports: [
        HeaderComponent
    ],
	imports: [
		CommonModule,
		RouterLink,
		RouterLinkActive,
		ModalModule.forRoot()
	]
})
export class CoreModule { }
