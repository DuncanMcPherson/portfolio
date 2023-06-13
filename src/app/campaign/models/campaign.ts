import {CampaignId} from "./campaign-id";
import {CampaignPath} from "./campaign-path";
import {CampaignPathId} from "./campaign-path-id";

export class Campaign {
	public campaignPathId: CampaignPathId;
	constructor(
		public readonly campaignId: CampaignId,
		public readonly campaignPaths: CampaignPath[]
	) {
	}

	public getPathId(pathId?: CampaignPathId): CampaignPathId {
		if (pathId) {
			this.campaignPathId = pathId;
			return pathId;
		}

		let total = this.getTotalThreshold()
		let currentMin = 0;
		let currentMax = 0;
		const selection = Math.floor(Math.random() * total);

		this.campaignPaths.forEach((path) => {
			currentMax += path.thresholdAmount;
			if (selection > currentMin && selection < currentMax) {
				pathId = path.pathId;
				this.campaignPathId = path.pathId;
			}
			currentMin += path.thresholdAmount;
		});

		return pathId;
	}

	private getTotalThreshold(): number {
		let total = 0;
		this.campaignPaths.forEach((path) => {
			total += path.thresholdAmount;
		});

		return total;
	}
}
