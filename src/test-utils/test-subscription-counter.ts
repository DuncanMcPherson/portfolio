import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

export class TestSubscriptionCounter<T> {
	private _lifetimeSubscriptionCount = 0;
	private _activeSubscriptionCount = 0;

	public readonly countedObservable$ = new Observable<T>((observer) => {
		this._lifetimeSubscriptionCount++;
		this._activeSubscriptionCount++;

		const subscription = this.observable$
			.pipe(finalize(() => this._activeSubscriptionCount--))
			.subscribe(observer);

		return () => subscription.unsubscribe();
	});

	constructor(private readonly observable$: Observable<T>) {	}
	public get lifetimeSubscriptionCount(): number {
		return this._lifetimeSubscriptionCount;
	}

	public get activeSubscriptionCount(): number {
		return this._activeSubscriptionCount;
	}

	public get hadSubscribers(): boolean {
		return this.lifetimeSubscriptionCount > 0;
	}

	public get hasActiveSubscribers(): boolean {
		return this.activeSubscriptionCount > 0;
	}

	public get allSubscriptionsFinalized(): boolean {
		return this.activeSubscriptionCount === 0;
	}
}
