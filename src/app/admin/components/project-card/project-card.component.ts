import {Component, Input} from '@angular/core';
import {IProject} from "../../../projects/models/project.model";

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
	@Input() public project: IProject;
}
