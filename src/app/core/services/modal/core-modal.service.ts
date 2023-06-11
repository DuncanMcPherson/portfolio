import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {AbstractModal} from "../../models/abstract-modal";
import {map, Observable, race, take, tap, throwError} from "rxjs";
import {IModalResult, ModalResultAction} from "../../models/modal-result";
import {Constructor} from "../../../../@types/typings";

export interface IModalOptions {
	ignoreBackdropClick?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class CoreModalService {
	private bsModalRef: BsModalRef;

	constructor(
		private readonly bsModalService: BsModalService
	) {
	}

	/**
	 * This method will open a modal that extends the AbstractModal class
	 * @param ctor The constructor type of the modal that we wish to open
	 * @param initialState The state of the data for the modal that we wish to open
	 * @param options The options for the modal including backdrop click, size, and modal classes
	 */
	public openModal<TInput, TOutput, TConstructor extends Constructor<AbstractModal<TInput, TOutput>>>(
		ctor: TConstructor,
		initialState?: TInput,
		options?: Partial<IModalOptions>
	): Observable<IModalResult<TOutput>> {
		if (this.bsModalRef) {
			return throwError(() => new Error('Cannot open multiple modals simultaneously'));
		}

		const parsedOptions = this.getParsedOptions(options ?? {}, initialState);

		this.bsModalRef = this.bsModalService.show(ctor, parsedOptions);

		const modalClose$ = (this.bsModalRef.content as AbstractModal<TInput, TOutput>).close$;
		const bsModalClose$ = this.bsModalService.onHide.pipe(
			map((reason: {dismissReason?: string}) => {
				if (reason?.dismissReason === 'backdrop-click') {
					return {
						result: ModalResultAction.dismiss,
						data: (void 0) as TOutput
					} as IModalResult<TOutput>;
				}
				return {
					data: (void 0) as TOutput,
					result: ModalResultAction.close
				} as IModalResult<TOutput>
			})
		);

		return race(modalClose$, bsModalClose$)
			.pipe(
				take(1),
				tap(() => {
					if (this.bsModalRef) {
						this.bsModalRef.hide();
						this.bsModalRef = undefined;
					}
				})
			)
	}

	/**
	 * This coerces the modal options into an object that the bsModalService can understand
	 * @param options The locally owned options to be coerced
	 * @param initialState The desired data for the modal
	 * @returns ModalOptions
	 */
	private getParsedOptions<T>(options: IModalOptions, initialState: T): ModalOptions<T> {
		return {
			initialState: initialState,
			ignoreBackdropClick: !!options.ignoreBackdropClick ? options.ignoreBackdropClick : false
		}
	}
}
