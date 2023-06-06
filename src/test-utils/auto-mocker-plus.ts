import { HttpErrorResponse } from "@angular/common/http";
import { NEVER, Observable, of, ReplaySubject, Subject, throwError } from "rxjs";
import { startWith } from "rxjs";
import { AutoMocker } from "./auto-mocker";
import { TestSubscriptionCounter } from "./test-subscription-counter";
import { ObservablePropertyNames } from "./observable-property-names.type";

type ObservableType<T> = T extends Observable<infer U> ? U : T;

export class AutoMockerPlus extends AutoMocker {
	public withReturnObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWith?: T,
		spyName?: string
	): Observable<T> {
		if (this.isSpyLike(spy)) {
			let observable: Observable<T> = of(resolveWith);
			spy.and.returnValue(observable);
			return observable;
		}

		this.throwNotASpyError(spyName);
	}

	public withReturnNonEmittingObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		spyName?: string
	): Observable<T> {
		if (this.isSpyLike(spy)) {
			const observable: Observable<T> = NEVER;
			spy.and.returnValue(observable);
			return observable;
		}
		this.throwNotASpyError(spyName)
	}

	public withReturnCompletingCountedObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		nextValue?: T,
		spyName?: string
	): TestSubscriptionCounter<T> {
		if (this.isSpyLike(spy)) {
			const observable: Observable<T> = of(nextValue);
			const counter = new TestSubscriptionCounter(observable);
			spy.and.returnValue(counter.countedObservable$);
			return counter;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnNonCompletingCountedObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		nextValue?: T,
		spyName?: string
	): TestSubscriptionCounter<T> {
		if (this.isSpyLike(spy)) {
			const nonCompletingObservable: Observable<T> = NEVER.pipe(startWith(nextValue));
			const counter = new TestSubscriptionCounter(nonCompletingObservable);
			spy.and.returnValue(counter.countedObservable$);
			return counter;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnObservables<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWith?: T[],
		spyName?: string
	): Observable<T>[] {
		if (this.isSpyLike(spy)) {
			const observables: Observable<T>[] = resolveWith.map((r) => {
				if (r instanceof Observable) {
					return r;
				}
				return of(r);
			});
			spy.and.returnValues(observables);
			return observables;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnThrowObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		error?: any,
		spyName?: string,
	): Observable<T> {
		if (this.isSpyLike(spy)) {
			let observable: Observable<T> = throwError(error);
			spy.and.returnValue(observable);
			return observable;
		}
		this.throwNotASpyError(spyName);
	}

	public withFirstArgMappedReturnObservable<T>(
		spy: (arg1: string | number, ...args: any[]) => Observable<T>,
		returnMap: Record<string | number, T>,
		defaultReturn: T = undefined,
		spyName?: string,
	): void {
		if (this.isSpyLike(spy)) {
			spy.and.callFake((key) =>
				Object.prototype.hasOwnProperty.call(returnMap, key)
					? of(returnMap[key])
					: of(defaultReturn)
			);
			return;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnSubjectForObservableProperty<
		T,
		K extends ObservablePropertyNames<T, any>,
		U extends ObservableType<T[K]>,
		>(
			objectMock: T,
			observablePropertyName: K,
			initialValue?: U,
			replayBuffer: number = 1
	): ReplaySubject<U> {
		const subject = new ReplaySubject<U>(replayBuffer);
		(objectMock[observablePropertyName] as any) = subject.asObservable();
		if (initialValue !== undefined) {
			subject.next(initialValue);
		}
		return subject;
	}

	public withReturnSubjectWithCompletingCountedObservableForObservableProperty<
		T,
		K extends ObservablePropertyNames<T, any>,
		U extends ObservableType<T[K]>,
	>(
		objectMock: T,
		observablePropertyName: K,
		initialValue?: U,
		replayBuffer: number = 1,
	): {
		subject: ReplaySubject<U>;
		counter: TestSubscriptionCounter<U>;
	} {
		const subject = new ReplaySubject<U>(replayBuffer);
		const counter = new TestSubscriptionCounter(subject.asObservable());
		(objectMock[observablePropertyName] as any) = counter.countedObservable$;
		if (initialValue !== undefined) {
			subject.next(initialValue);
		}
		return {
			subject,
			counter,
		};
	}

	public withReturnSubjectAsObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWith?: T,
		spyName?: string,
	): Subject<T> {
		if (this.isSpyLike(spy)) {
			const subject: Subject<T> = new Subject<T>();
			if (resolveWith !== undefined) {
				subject.next(resolveWith);
			}
			const observable: Observable<T> = subject.asObservable();
			spy.and.returnValue(observable);
			return subject;
		}
		this.throwNotASpyError(spyName)
	}

	public withReturnReplaySubjectAsObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWith?: T,
		bufferSize: number = 1,
		spyName?: string,
	): ReplaySubject<T> {
		if (this.isSpyLike(spy)) {
			const subject = new ReplaySubject<T>(bufferSize);
			if (resolveWith !== undefined) {
				subject.next(resolveWith);
			}
			const observable = subject.asObservable();
			spy.and.returnValue(observable);
			return subject;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnSubjectWithErrorAsObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWithError?: any,
		spyName?: string,
	): Subject<T> {
		if (this.isSpyLike(spy)) {
			let subject = new Subject<T>();
			if (resolveWithError) {
				subject.error(resolveWithError);
			} else {
				subject.error(new Error("error"));
			}
			let observable: Observable<T> = subject.asObservable();
			spy.and.returnValue(observable);
			return subject;
		}
		this.throwNotASpyError(spyName);
	}

	public withReturnSubjectWithHttpErrorAsObservable<T>(
		spy: (...args: any[]) => Observable<T>,
		resolveWithHttpError?: HttpErrorResponse,
		spyName?: string,
	): Subject<T> {
		if (this.isSpyLike(spy)) {
			let subject: Subject<T> = new Subject<T>();
			if (resolveWithHttpError) {
				subject.error(resolveWithHttpError);
			} else {
				subject.error(new HttpErrorResponse({}));
			}
			let observable: Observable<T> = subject.asObservable();
			spy.and.returnValue(observable);
			return subject;
		}
		return this.throwNotASpyError(spyName);
	}

	public withReturnPromise<T>(
		spy: (...args: any[]) => Promise<T>,
		resolveWith?: T,
		spyName?: string,
	): Promise<T> {
		if (this.isSpyLike(spy)) {
			const promise = Promise.resolve(resolveWith);
			spy.and.returnValue(promise);
			return promise;
		}
		return this.throwNotASpyError(spyName);
	}

	public withReturnRejectedPromise<T>(
		spy: (...args: any[]) => Promise<T>,
		rejectWith?: any,
		spyName?: string,
	): Promise<T> {
		if (this.isSpyLike(spy)) {
			const promise = Promise.reject(rejectWith);
			spy.and.returnValue(promise);
			return promise;
		}
		return this.throwNotASpyError(spyName);
	}

}

export const autoMockerInstance = new AutoMockerPlus();
