import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "../../core/services/environment/environment.service";
import {catchError, Observable, of} from "rxjs";
import {IPreview} from "../../projects/models/preview.model";
import {ILinkPreviewParams} from "../models/link-preview-params.model";

@Injectable({
	providedIn: 'root'
})
export class LinkPreviewService {

	constructor(
		private readonly http: HttpClient,
		private readonly environmentService: EnvironmentService
	) {
	}

	public getLinkPreview(url: string): Observable<IPreview> {
		const params: ILinkPreviewParams = {
			key: this.environmentService.linkPreviewKey,
			q: url
		};

		return this.http.get<IPreview>(this.environmentService.linkPreviewApi, {
			params: {
				...params
			}
		}).pipe(
			catchError(() => {
				return of({
					url,
				} as IPreview)
			})
		);
	}
}
