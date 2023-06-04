import {Injectable} from '@angular/core';
import {ref, getDownloadURL, getStorage, list, deleteObject, FirebaseStorage, uploadBytes} from "firebase/storage";
import {AppService} from "../app/app.service";
import {from, map, Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	private _storage?: FirebaseStorage;

	public get storage(): FirebaseStorage {
		return this._storage as FirebaseStorage;
	}

	private set storage(value: FirebaseStorage) {
		this._storage = value;
	}

	constructor(
		private readonly appService: AppService
	) {
		this.storage = getStorage(appService.app);
	}

	public getListOfItems(path?: string) {
		return from(list(ref(this.storage, path)));
	}

	public getItemDownloadUrl(path: string): Observable<string> {
		const locationRef = ref(this.storage, path);
		return from(getDownloadURL(locationRef));
	}

	public uploadItem(item: Blob, itemPath: string): Observable<{ success: boolean }> {
		return from(uploadBytes(ref(this.storage, itemPath), item))
			.pipe(
				map((result) => {
					return {
						success: !!result.ref.fullPath
					}
				})
			)
	}

	public deleteItem(path: string): Observable<void> {
		const locationRef = ref(this.storage, path);
		return from(deleteObject(locationRef));
	}
}
