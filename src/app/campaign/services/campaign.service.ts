import {Injectable} from '@angular/core';
import {CampaignConfig} from "./campaign.config";
import {BrowserStorageService} from "../../core/services/browser-storage/browser-storage.service";
import {Campaign} from "../models/campaign";
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {BrowserStorageKey, BrowserStorageLocation} from "../../core/services/browser-storage/browser-storage.enum";
import {CampaignId} from "../models/campaign-id";
import {CampaignPathId} from "../models/campaign-path-id";

interface ICampaignStorage {
	[key: string]: CampaignPathId
}

@Injectable({
	providedIn: 'root'
})
export class CampaignService {
	private config = new CampaignConfig();

	private campaignSubject$$: BehaviorSubject<Campaign[]> = new BehaviorSubject<Campaign[]>([]);
	public campaigns$: Observable<Campaign[]> = this.campaignSubject$$.asObservable();
	constructor(
		private readonly browserStorageService: BrowserStorageService
	) {
	}

	public getCampaign$(campaignId: CampaignId): Observable<CampaignPathId> {
		const storedValues = this.browserStorageService.getParsedItem<ICampaignStorage>(BrowserStorageLocation.local, BrowserStorageKey.campaign);
		if (!storedValues || !storedValues[campaignId]) {
			const campaign = this.config.config.find(x => x.campaignId === campaignId);
			this.ensureObservableUpToDate(campaign);
			campaign && campaign.getPathId();
			const updatedStoredValues = {
				...storedValues,
				[campaignId]: campaign.campaignPathId
			}
			this.browserStorageService.setOrUpdateItem(BrowserStorageLocation.local, BrowserStorageKey.campaign, updatedStoredValues);
			return this.campaigns$.pipe(
				map((campaigns) => {
					return campaigns.find(x => x.campaignId === campaignId)?.campaignPathId
				})
			)
		}

		return of(storedValues[campaignId]);
	}

	private ensureObservableUpToDate(campaign: Campaign): void {
		const current = this.campaignSubject$$.value;
		const hasCampaign = !!current.find(x => x.campaignId === campaign.campaignId);
		if (!hasCampaign) {
			const updated = [
				...current,
				campaign
			];
			this.campaignSubject$$.next(updated);
		}
	}
}
