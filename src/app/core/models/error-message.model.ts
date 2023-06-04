export interface IErrorMessages {
	readonly [key: string]: string;
	readonly minlength?: string;
	readonly maxlength?: string;
	readonly mask?: string;
	readonly pattern?: string;
	readonly required?: string;
}
