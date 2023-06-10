export interface IModalResult<T> {
	result: ModalResultAction;
	data: T
}

export enum ModalResultAction {
	accept = 'accept',
	close = 'close',
	dismiss = 'dismiss'
}
