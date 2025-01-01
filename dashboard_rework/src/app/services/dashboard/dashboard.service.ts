import { Injectable, OnDestroy } from '@angular/core';
import {Database, ref, set, onValue, get, Unsubscribe, remove} from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dashboard_interface } from '../../interfaces/dashboard_interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnDestroy {
  private subscription: Unsubscribe | null = null;

  constructor(private db: Database) {}

  // Function to filter and map the data
  private filterAndMapData(data: any[]): Dashboard_interface[] {
    return data.map(item => ({
      name: item.name || '', // Default value
      helpDocUrl: item.helpDocUrl || '',
      helpDocHeight: item.helpDocHeight || 0,
      helpDocWidth: item.helpDocWidth || 0,
      pageTitle: item.pageTitle || '',
      coords: Array.isArray(item.coords) && item.coords.length === 2
        ? [Number(item.coords[0]), Number(item.coords[1])] // Ensure coords is a tuple of two numbers
        : [0, 0], // Default value if not valid
      widgetsInUse: item.widgetsInUse || []
    }));
  }

  // Fetch dashboards from the database
  getDashboards(): Observable<Dashboard_interface[]> {
    console.log('Fetching dashboards...');

    const dashboardsRef = ref(this.db, 'dashboards'); // Directly use db

    return new Observable<Dashboard_interface[]>((observer) => {
      this.subscription = onValue(dashboardsRef, (snapshot) => {
        const data = snapshot.val();
        const dashboards: Dashboard_interface[] = data ? this.filterAndMapData(Object.values(data)) : [];

        console.log('Dashboards fetched from database:', dashboards);
        console.log('Data source: Database');
        observer.next(dashboards);
      }, {
        onlyOnce: false // Change to false if you want to listen for changes continuously
      });
    }).pipe(
      catchError((error) => {
        console.error('Error fetching dashboards:', error);
        return of([]); // Return empty array in case of error
      })
    );
  }

  // Add a new dashboard
  async addDashboard(dashboard: Dashboard_interface): Promise<void> {
    const newDashboardRef = ref(this.db, `dashboards/${dashboard.name}`); // Ensure dashboard.pageTitle exists
    console.log('Adding new dashboard:', dashboard);

    // Ensure coords is a tuple of two numbers
    if (!Array.isArray(dashboard.coords) || dashboard.coords.length !== 2) {
      console.error('Invalid coords format. It should be a tuple of two numbers.');
      return;
    }

    try {
      await set(newDashboardRef, dashboard);
      console.log('Dashboard added successfully:', dashboard);
    } catch (error) {
      console.error('Error adding dashboard:', error);
    }
  }

  // Fetch a specific dashboard by name
  async getDashboardByName(name: string): Promise<Dashboard_interface | null> {
    console.log('Fetching dashboard by name:', name);
    const dashboardsRef = ref(this.db, 'dashboards');

    try {
      const snapshot = await get(dashboardsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dashboards: Dashboard_interface[] = this.filterAndMapData(Object.values(data));

        // Find the dashboard with the matching name
        const foundDashboard = dashboards.find(dashboard => dashboard.name === name);
        return foundDashboard || null; // Return the found dashboard or null if not found
      } else {
        console.log('No dashboards found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching dashboard by name:', error);
      return null; // Return null in case of error
    }
  }


  async deleteDashboardByName(name: string): Promise<void> {
    const dashboardRef = ref(this.db, `dashboards/${name}`);
    try {
      await remove(dashboardRef);
      console.log(`Dashboard "${name}" deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting dashboard "${name}":`, error);
    }
  }


  ngOnDestroy(): void {
    // Clean up the subscription if it exists
    if (this.subscription) {
      this.subscription(); // Call the unsubscribe function
    }
  }
}
