import {Component, Input} from '@angular/core';
import {IProject} from "../../models/project.model";

@Component({
  selector: 'app-public-project-card',
  templateUrl: './public-project-card.component.html',
  styleUrls: ['./public-project-card.component.scss']
})
export class PublicProjectCardComponent {
	@Input() public project: IProject;
}
