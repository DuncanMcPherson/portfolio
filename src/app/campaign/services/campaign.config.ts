import {Campaign} from "../models/campaign";
import {CampaignId} from "../models/campaign-id";
import {CampaignPath} from "../models/campaign-path";
import {CampaignPathId} from "../models/campaign-path-id";

export class CampaignConfig {
	public config: Campaign[]
	constructor() {
		this.config = [
			new Campaign(
				CampaignId.FeatureBuilds,
				[
					new CampaignPath(CampaignPathId.Control, 100),
					new CampaignPath(CampaignPathId.A, 0)
				]
			)
		]
	}
}
