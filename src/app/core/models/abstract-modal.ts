import {IModalResult, ModalResultAction} from "./modal-result";
import {Observable, Subject} from "rxjs";

export class AbstractModal<TInput, TOutput> {
	public data: TInput;
	private close$$: Subject<IModalResult<TOutput>> = new Subject<IModalResult<TOutput>>();
	public close$: Observable<IModalResult<TOutput>> = this.close$$.asObservable();

	protected close(action: ModalResultAction, data?: TOutput): void {
		const modalResult: IModalResult<TOutput> = {
			result: action,
			data: data
		};

		this.close$$.next(modalResult);
	}
}
