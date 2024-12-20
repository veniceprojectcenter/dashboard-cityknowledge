import { Component } from '@angular/core';
import {MenuWidgetComponent} from '../../common/menu-widget/menu-widget.component';
import {WidgetFormComponent} from '../../common/widget-form/widget-form.component';

@Component({
  selector: 'app-create-widget',
  standalone: true,
  templateUrl: './create-widget.component.html',
  styleUrls: ['./create-widget.component.css'],
  imports: [WidgetFormComponent]
})
export class CreateWidgetComponent {

}
