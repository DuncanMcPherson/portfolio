import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractModal} from "../../../core/models/abstract-modal";
import {IProject} from "../../../projects/models/project.model";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {IPreview} from "../../../projects/models/preview.model";
import {combineLatest, filter, map, Subject, take, takeUntil, tap} from "rxjs";
import {ModalResultAction} from "../../../core/models/modal-result";

interface IProjectForm {
	projectTitle: FormControl<string>;
	projectUrl: FormControl<string>;
	isInternal: FormControl<boolean>;
	roleDescription: FormControl<string>;
}

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent extends AbstractModal<void, IProject> implements OnInit, OnDestroy {
	public form: FormGroup;

	public preview: IPreview;

	private destroy$$: Subject<void> = new Subject<void>();

	public get titleControl(): FormControl {
		return this.form.get('projectTitle') as FormControl;
	}

	public get urlControl(): FormControl {
		return this.form.get('projectUrl') as FormControl;
	}

	public get isInternalControl(): FormControl {
		return this.form.get('isInternal') as FormControl;
	}

	public get descriptionControl(): FormControl {
		return this.form.get('roleDescription') as FormControl;
	}

	constructor(
		private readonly linkPreviewService: LinkPreviewService
	) {
		super();
	}

	public ngOnInit(): void {
		this.form = new FormGroup<IProjectForm>({
			projectTitle: new FormControl('', [Validators.required, Validators.minLength(5)]),
			projectUrl: new FormControl<string>('', [Validators.required, this.urlValidators]),
			isInternal: new FormControl<boolean>(true),
			roleDescription: new FormControl<string>('', [Validators.minLength(45)])
		});

		combineLatest([
			this.urlControl.statusChanges,
			this.urlControl.valueChanges,
			this.isInternalControl.valueChanges
		]).pipe(
			takeUntil(this.destroy$$),
			filter(([status, value]) => {
				return status === 'VALID' && value.length > 1
			}),
			map(([_, url, isInternal]: [any, string, boolean]) => {
				return [url, isInternal];
			}),
			tap(([url, isInternal]: [string, boolean]) => {
				this.preview = null;
				if (!isInternal) {
					this.linkPreviewService.getLinkPreview(url)
						.pipe(
							take(1),
						).subscribe((preview) => {
							this.preview = preview;

					})
				}
			})
		).subscribe();
	}

	public ngOnDestroy(): void {
		this.destroy$$.next();
	}

	public saveProject(): void {
		if (!this.form.value) {
			return;
		}
		const formValue = this.form.value;

		const project: IProject = {
			title: formValue.projectTitle,
			url: formValue.projectUrl,
			roleDescription: formValue.roleDescription,
			isInternal: formValue.isInternal
		} as IProject;

		this.close(ModalResultAction.accept, project);
	}

	public closeModal(): void {
		this.close(ModalResultAction.close);
	}

	private urlValidators(control: AbstractControl<string>): ValidationErrors | null {
		if (!control.value) {
			return null;
		}

		const regTest = RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%._+~#?&\/=]*)$/);
		const matches = regTest.test(control.value);
		return matches ? null : { notAUrl: true };
	}
}
