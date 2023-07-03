import {Injectable} from '@angular/core';
import {AppService} from "../app/app.service";
import { get, ref, set, Database, getDatabase, onValue } from "firebase/database";
import {BehaviorSubject, from, map, Observable, take, tap} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private readonly _database: Database;

	private get database(): Database {
		return this._database;
	}

	constructor(
		private readonly appService: AppService
	) {
		this._database = getDatabase(appService.app);
	}

	public get<T>(location: string): Observable<T> {
		const subject = new BehaviorSubject<T>(null);

		onValue(ref(this.database, location), (data) => {
			const value = data.val();
			subject.next(value as T);
		});

		if(!!subject.value) {
			from(get(ref(this.database, location)))
				.pipe(
					take(1),
					tap((value) => {
						const data = value.val() as T;
						subject.next(data);
					})
				).subscribe()
		}

		return subject.asObservable();
	}

	public setValue<T>(location: string, value: T): void {
		const locationRef = ref(this.database, location);

		void set(locationRef, value);
	}
}
