import {Component, OnInit} from '@angular/core';
import {AbstractModal} from "../../../core/models/abstract-modal";
import {IProject} from "../../../projects/models/project.model";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ModalResultAction} from "../../../core/models/modal-result";

interface IEditProjectForm {
	title: FormControl<string>;
	url: FormControl<string>;
	roleDescription: FormControl<string>;
}

interface IEditProjectModalDataModel {
	project: IProject
}

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss']
})
export class EditProjectModalComponent extends AbstractModal<IEditProjectModalDataModel, IProject> implements IEditProjectModalDataModel, OnInit {
	public project: IProject;

	public form: FormGroup<IEditProjectForm>;

	public get titleControl(): FormControl {
		return this.form.get('title') as FormControl;
	}

	public get urlControl(): FormControl {
		return this.form.get('url') as FormControl;
	}

	public get descriptionControl(): FormControl {
		return this.form.get('roleDescription') as FormControl;
	}

	public ngOnInit(): void {
		this.form = new FormGroup<IEditProjectForm>({
			title: new FormControl<string>(this.project.title, [Validators.required, Validators.minLength(5)]),
			url: new FormControl<string>(this.project.url, [Validators.required, this.urlValidator]),
			roleDescription: new FormControl<string>(this.project.roleDescription, Validators.minLength(45))
		})
	}

	public saveProject(): void {
		if (!this.form.value || !this.form.valid) {
			return;
		}

		const projectValue: IProject = this.form.value as IProject;

		const project = {
			...projectValue,
			id: this.project.id
		}

		this.close(ModalResultAction.accept, project);
	}

	public closeModal(): void {
		this.close(ModalResultAction.close)
	}

	private urlValidator(control: AbstractControl<string>): ValidationErrors | null {
		if (!control.value) {
			return null;
		}

		const regTest = new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-z0-9]{1,6}\b(?:[-a-zA-Z0-9()@:%._+~#?&\/=]*)$/);
		const matches = regTest.test(control.value);
		return matches ? null : {notAUrl: true };
	}
}
