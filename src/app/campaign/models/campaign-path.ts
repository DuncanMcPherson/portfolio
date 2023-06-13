import {CampaignPathId} from "./campaign-path-id";

export class CampaignPath {
	constructor(
		public readonly pathId: CampaignPathId,
		public readonly thresholdAmount: number
	) {}
}
