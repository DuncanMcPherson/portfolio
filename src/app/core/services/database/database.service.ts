import {Injectable} from '@angular/core';
import {AppService} from "../app/app.service";
import { get, ref, set, Database, getDatabase } from "firebase/database";
import {from, map, Observable} from "rxjs";

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
		const locationRef = ref(this.database, location);

		return from(get(locationRef))
			.pipe(
				map((dataSnapshot) => {
					return dataSnapshot.val() as T;
				})
			);
	}

	public setValue<T>(location: string, value: T): void {
		const locationRef = ref(this.database, location);

		void set(locationRef, value);
	}
}
