import { Injectable } from '@angular/core';
import { Database, ref, set, onValue, get } from '@angular/fire/database';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WidgetInterface } from '../../interfaces/widget-interface'; // Ensure you import the interface

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  constructor(private db: Database) {}

  // Function to filter and map the data
  private filterAndMapData(data: any[]): WidgetInterface[] {
    return data.map(item => ({
      id: item.id || '', // Default value
      title: item.title || '',
      contentHTML: item.contentHTML || '',
      height: item.height || 0,
      width: item.width || 0,
      helpDocUrl: item.helpDocUrl || '',
      url: item.url || '',
      urlTitle: item.urlTitle || ''
    }));
  }

  // Fetch widget from the database under the widget node
  getWidgets(): Observable<WidgetInterface[]> {
    const widgetsRef = ref(this.db, 'widgets'); // Path to widget
    console.log('Fetching widget from database...');

    return new Observable<WidgetInterface[]>((observer) => {
      onValue(widgetsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const widgets = this.filterAndMapData(Object.values(data)); // Filter and map the widget
          console.log('Widgets fetched from database:', widgets);
          observer.next(widgets);
        } else {
          console.log('No widget found in database.');
          observer.next([]); // Return empty array if no data
        }
      }, {
        onlyOnce: false // Change to false if you want to listen for changes continuously
      });
    }).pipe(
      catchError((error) => {
        console.error('Error fetching widget:', error);
        return of([]); // Return empty array in case of error
      })
    );
  }

  // Add a new widget under the widget node
  addWidget(widget: WidgetInterface): Promise<void> {
    const newWidgetRef = ref(this.db, `widgets/${widget.id}`); // Modify based on your data structure
    console.log('Adding new widget:', widget);

    return set(newWidgetRef, widget).then(() => {
      console.log('Widget added successfully:', widget);
    }).catch((error) => {
      console.error('Error adding widget:', error);
    });
  }

  // Fetch widget by an array of IDs
  getWidgetsByIdsArray(ids: string[]): Observable<WidgetInterface[]> {
    const widgetPromises = ids.map(id => {
      const widgetRef = ref(this.db, `widgets/${id}`);
      return get(widgetRef).then(snapshot => {
        if (snapshot.exists()) {
          return this.filterAndMapData([snapshot.val()])[0]; // Return the widget if it exists
        } else {
          console.log(`Widget with ID ${id} not found.`);
          return null; // Return null if not found
        }
      }).catch(error => {
        console.error(`Error fetching widget with ID ${id}:`, error);
        return null; // Return null in case of error
      });
    });

    return new Observable<WidgetInterface[]>((observer) => {
      forkJoin(widgetPromises).subscribe(widgets => {
        // Filter out null values (widget that were not found)
        const filteredWidgets = widgets.filter(widget => widget !== null) as WidgetInterface[];
        observer.next(filteredWidgets);
        observer.complete();
      });
    }).pipe(
      catchError((error) => {
        console.error('Error fetching widget by IDs:', error);
        return of([]); // Return empty array in case of error
      })
    );
  }
}
