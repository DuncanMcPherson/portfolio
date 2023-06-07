import {FormHelperService} from "../../app/core/services/form-helper.service";
import {autoMockerInstance} from "../auto-mocker-plus";

export function createFormHelperServiceMock(): FormHelperService {
	return autoMockerInstance.mockClass(FormHelperService);
}
