import {Injectable} from '@angular/core';
import {MemoryStorage} from "./memory-storage";
import {BrowserStorageKey, BrowserStorageLocation} from "./browser-storage.enum";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
	private memoryStorage = new MemoryStorage();
	private observableStore: {[key: string]: BehaviorSubject<any>} = {};

	public observe<T>(location: BrowserStorageLocation, key: BrowserStorageKey): Observable<T> {
		let subject = this.observableStore[key];

		if (!subject) {
			subject = new BehaviorSubject<T>(null);
		}

		const value = this.getParsedItem<T>(location, key)
		if (value) {
			subject.next(value);
		}

		return subject.asObservable();
	}

	public getParsedItem<T>(location: BrowserStorageLocation, key: BrowserStorageKey): T {
		return this.parseItem(this.getItem(location, key));
	}

	public getItem(location: BrowserStorageLocation, key: BrowserStorageKey): string {
		return this.getStorage(location).getItem(key);
	}

	public setOrUpdateItem<T>(location: BrowserStorageLocation, key: BrowserStorageKey, value: T): void {
		const itemString = this.getItemAsString(value);
		this.getStorage(location).setItem(key, itemString);
		this.ensureObservableUpdated(value, key);
	}

	public removeItem(location: BrowserStorageLocation, key: BrowserStorageKey): void {
		this.getStorage(location).removeItem(key);
	}

	private ensureObservableUpdated<T>(value: T, key: BrowserStorageKey): void {
		const subject = this.observableStore[key];
		if (subject) {
			subject.next(value);
		}
	}

	private parseItem<T>(itemString: string): T {
		try {
			return JSON.parse(itemString) as T;
		} catch {
			return itemString as T & string;
		}
	}

	private getItemAsString<T>(item: T): string {
		if (typeof item === 'string') {
			return item;
		}

		return JSON.stringify(item);
	}

	private getStorage(storageLocation: BrowserStorageLocation): Storage {
		const storageToTry = storageLocation === BrowserStorageLocation.local ? localStorage : sessionStorage;
		return this.checkIsStorageAvailable(storageToTry);
	}

	private checkIsStorageAvailable(storage: Storage): Storage {
		try {
			const testItem = '__TEST__';
			storage.setItem(testItem, testItem);
			storage.removeItem(testItem);
			return storage;
		} catch {
			return this.memoryStorage;
		}
	}
}
