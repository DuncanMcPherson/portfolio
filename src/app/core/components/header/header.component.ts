import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatestWith, filter, map, Observable, Subject, takeUntil, tap} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {CampaignService} from "../../../campaign/services/campaign.service";
import {CampaignId} from "../../../campaign/models/campaign-id";
import {CampaignPathId} from "../../../campaign/models/campaign-path-id";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
	public isMenuOpen$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public vm$?: Observable<{ isMenuOpen: boolean, showFeature: boolean }>
	private destroy$$: Subject<void> = new Subject();

	constructor(
		private readonly router: Router,
		private readonly campaignService: CampaignService
	) {
	}

	public ngOnInit(): void {
		this.vm$ = this.isMenuOpen$$.pipe(
			combineLatestWith(this.campaignService.getCampaign$(CampaignId.FeatureBuilds).pipe(
				map((campaignPathId) => campaignPathId === CampaignPathId.A)
			)),
			map(([isOpen, showFeature]: [boolean, boolean]) => {
				return {
					isMenuOpen: isOpen,
					showFeature: showFeature
				}
			})
		);

		this.router.events
			.pipe(
				takeUntil(this.destroy$$),
				filter(e => e instanceof NavigationEnd),
				tap(() => {
					this.isMenuOpen$$.next(false)
				})
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.destroy$$.next();
	}

	public toggleMenuState(currentState: boolean): void {
		this.isMenuOpen$$.next(!currentState);
	}
}
