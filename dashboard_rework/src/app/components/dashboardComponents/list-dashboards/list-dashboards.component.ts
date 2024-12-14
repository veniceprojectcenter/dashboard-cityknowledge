import { Component, OnInit, NgZone } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Dashboard_interface } from '../../../interfaces/dashboard_interface';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router'; // Adjust the import path as necessary

@Component({
  selector: 'app-list-dashboards',
  standalone: true,
  templateUrl: './list-dashboards.component.html',
  imports: [
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./list-dashboards.component.css'] // Corrected from styleUrl to styleUrls
})
export class ListDashboardsComponent implements OnInit {
  dashboards: Dashboard_interface[] = []; // Property to hold the dashboards

  constructor(private _dashboardService: DashboardService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {this.loadDashboards()});
// Load dashboards when the component initializes
  }

  private loadDashboards(): void {
      this._dashboardService.getDashboards().subscribe(
        (dashboards: Dashboard_interface[]) => {
          this.ngZone.run(() => { // Re-enter Angular zone to update the view
            this.dashboards = dashboards; // Store the fetched dashboards
          });
        },
        (error) => {
          console.error('Error fetching dashboards:', error); // Handle errors
        }
      );
  }


  deleteDashboard(name: string): void {
    if (confirm(`Are you sure you want to delete the dashboard "${name}"?`)) {
      this._dashboardService.deleteDashboardByName(name)
        .then(() => {
          // Refresh the list after deletion
          this.dashboards = this.dashboards.filter(d => d.name !== name);
        })
        .catch((error) => {
          console.error('Error deleting dashboard:', error);
        });
    }
  }
}
