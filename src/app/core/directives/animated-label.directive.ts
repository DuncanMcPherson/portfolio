import {AfterContentInit, Directive, ElementRef, Inject, Input, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {appSetInterval} from "../functions/appSetInterval";
import some from "lodash-es/some";

@Directive({
	selector: '[appAnimatedLabel]'
})
export class AnimatedLabelDirective implements AfterContentInit, OnDestroy {
	@Input() public id?: string;
	@Input() public appAnimatedLabel: string;
	@Input() public appAnimatedLabelObservable?: Observable<string>;

	private wrapperClassName = 'form-control-wrapper';
	private animationClassName = "animated";
	private observer: MutationObserver;
	private labelTextSubscription: Subscription;
	private hasFocus = false;
	private labelElement: HTMLLabelElement;

	constructor(
		private readonly elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>,
		@Inject(DOCUMENT) private document: Document
	) {
	}

	public ngAfterContentInit(): void {
		const labelText = this.appAnimatedLabel || this.elementRef.nativeElement.getAttribute('placeholder');
		if (!labelText || labelText.trim() === '') {
			return;
		}

		this.elementRef.nativeElement.setAttribute('placeholder', '');
		this.elementRef.nativeElement.classList.add('animated-form-control');
		this.wrapElement(this.elementRef);

		const id = this.setInputId(this.elementRef);
		this.labelElement = this.addLabel(this.elementRef, id, labelText);

		this.setupAnimationListeners(this.labelElement);
		this.subscribeToLabelTextChanges();
		this.listenForChromeAutofillAndAnimateIfItHappens();
	}

	public ngOnDestroy(): void {
		this.observer.disconnect();
		if (this.labelTextSubscription) {
			this.labelTextSubscription.unsubscribe();
		}
	}

	private listenForChromeAutofillAndAnimateIfItHappens(): void {
		let autoFillIntervalIterations = 0;
		const autofillInterval = appSetInterval(() => {
			const isThisElementAutoSelected = this.document.querySelector(
				`input[id="${this.id}"]:-webkit-autofill`
			);
			if (isThisElementAutoSelected) {
				this.labelElement.classList.add(this.animationClassName);
				clearInterval(autofillInterval);
			}
			if (++autoFillIntervalIterations >= 20) {
				clearInterval(autofillInterval);
			}
		}, 100);
	}

	private setInputId(elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>): string {
		if (!this.id || this.id.trim() === '') {
			this.id = Math.floor(Math.random() * 10000).toString();
			elementRef.nativeElement.setAttribute('id', this.id);
		}

		return this.id;
	}

	private addLabel(elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>, inputId: string, labelText: string): HTMLLabelElement {
		const labelElement: HTMLLabelElement = document.createElement('label');
		labelElement.classList.add('animated-label');
		labelElement.setAttribute('for', inputId);
		labelElement.innerHTML = labelText;
		elementRef.nativeElement.parentElement.appendChild(labelElement);
		return labelElement;
	}

	private subscribeToLabelTextChanges(): void {
		if (this.appAnimatedLabelObservable) {
			this.labelTextSubscription = this.appAnimatedLabelObservable.subscribe((text) => {
				this.labelElement.innerHTML = text;
				this.evaluateAnimationClassName(this.labelElement);
			});
		}
	}

	private wrapElement(elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>): void {
		if (this.parentHasWrapperClass(elementRef.nativeElement)) {
			return;
		}

		const wrapper = document.createElement('div');
		wrapper.classList.add(this.wrapperClassName);
		this.addElementTypeClassToWrapper(wrapper, elementRef);

		elementRef.nativeElement.parentNode.insertBefore(wrapper, elementRef.nativeElement);
		wrapper.appendChild(elementRef.nativeElement);
	}

	private parentHasWrapperClass(element: HTMLElement): boolean {
		return some(element.parentElement.classList, this.wrapperClassName);
	}

	private addElementTypeClassToWrapper(wrapper: HTMLElement, elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>): void {
		if (this.getElementType(elementRef) === 'select') {
			wrapper.classList.add('is-select');
		}

		if (this.getElementType(elementRef) === 'input') {
			wrapper.classList.add('is-input')
		}
	}

	private getElementType(elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>): string {
		return elementRef.nativeElement.tagName.toLowerCase();
	}

	private setupAnimationListeners(labelElement: HTMLLabelElement): void {
		this.evaluateAnimationClassName(labelElement);
		this.elementRef.nativeElement.addEventListener('focus', () => {
			this.hasFocus = true;
			this.evaluateAnimationClassName(labelElement);
		});
		this.elementRef.nativeElement.addEventListener('blur', () => {
			this.hasFocus = false;
			this.evaluateAnimationClassName(labelElement);
		});
		this.observer = new MutationObserver((): void => {
			this.evaluateAnimationClassName(labelElement);
		});
		this.observer.observe(this.elementRef.nativeElement, {
			attributes: true,
			childList: true,
			subtree: true
		});
	}

	private evaluateAnimationClassName(labelElement: HTMLLabelElement): void {
		if (!this.elementRef || !labelElement) {
			return;
		}

		if (this.hasFocus || this.elementRef.nativeElement.value) {
			labelElement.classList.add(this.animationClassName);
			return;
		}

		if (!this.elementRef.nativeElement.value && this.elementRef.nativeElement.type !== "date") {
			labelElement.classList.remove(this.animationClassName);
		}
	}

}
