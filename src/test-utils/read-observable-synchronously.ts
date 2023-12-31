import {Observable, skip as skipOperator, take, tap} from "rxjs";

export function readObservableSynchronously<T>(observable$: Observable<T>, skip: number = 0): T {
	return readObservableSynchronouslyAfterAction(observable$, () => {
	}, skip);
}

export function readObservableSynchronouslyAfterAction<T>(
	observable$: Observable<T>,
	action: () => void,
	skip: number = 0
): T {
	if (!observable$) {
		fail(`cannot subscribe to ${observable$}`);
	}
	if (!action) {
		fail(`action (${action}) is required`);
	}

	let actualResult: T;
	let emitted = false;
	let emissionCount = 0;

	const subscription = observable$
		.pipe(
			tap(() => emissionCount++),
			skipOperator(skip),
			take(1)
		).subscribe({
			next: (result) => {
				actualResult = result;
				emitted = true;
			},
			error: (err) => fail(err)
		});

	action();

	if (!emitted) {
		subscription.unsubscribe();
		fail(
			`observable did not emit (skips requested: ${skip}, total skipped emmissions: ${emissionCount})`,
		);
	}

	return actualResult;
}

export function readObservableErrorSynchronously(
	observable$: Observable<any>,
	skip: number = 0,
): any {
	if (!observable$) {
		fail(`cannot subscribe to ${observable$}`);
	}

	let actualError: any;
	let emitted = false;
	let emissionCount = 0;

	const subscription = observable$
		.pipe(
			tap(() => emissionCount++),
			skipOperator(skip),
			take(1),
		)
		.subscribe({
			next: (val) => fail(val),
			error: (error) => {
				actualError = error;
				emitted = true;
			},
		});

	if (!emitted) {
		subscription.unsubscribe();
		fail(
			`observable did not emit error (skips requested: ${skip}, total skipped emmissions: ${emissionCount})`,
		);
	}

	return actualError;
}

export function readObservableCompletionSynchronously(
	observable$: Observable<any>,
	skip: number = 0,
): boolean {
	if (!observable$) {
		fail(`cannot subscribe to ${observable$}`);
	}

	let actualComplete: boolean;
	let emitted = false;
	let emissionCount = 0;

	const subscription = observable$
		.pipe(
			tap(() => emissionCount++),
			skipOperator(skip),
			take(1),
		)
		.subscribe({
			next: (val) => fail(val),
			error: (error) => fail(error),
			complete: () => {
				actualComplete = true;
				emitted = true;
			},
		});

	if (!emitted) {
		subscription.unsubscribe();
		fail(
			`observable did not emit complete (skips requested: ${skip}, total skipped emmissions: ${emissionCount})`,
		);
	}

	return actualComplete;
}
