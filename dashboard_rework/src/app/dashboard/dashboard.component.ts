import { Component, OnInit, NgZone, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { WidgetService } from '../services/widget/widget.service';
import { DashboardInterface } from '../interfaces/dashboard-interface';
import { WidgetInterface } from '../interfaces/widget-interface';
import { GridstackModule, NgGridStackOptions, GridstackComponent } from 'gridstack/dist/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridstackModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  public gridOptions: NgGridStackOptions = {
    margin: 30,
    minRow: 1,
    children: []
  };

  @ViewChild(GridstackComponent) gridstackComponent!: GridstackComponent; // Reference to the grid

  dashboard: DashboardInterface | null = null;
  loadingDashboard = true; // Variabile per gestire il caricamento
  errorDashboard: string | null = null;
  widgetsInUse: WidgetInterface[] = [];
  showHelpDoc = false;
  safeHelpDocUrl: SafeResourceUrl | null = null;

  constructor(
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer // Inietta DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.fetchDashboard(name);
        console.log(name);
      }
    });
  }

  private fetchDashboard(name: string): void {
    this.loadingDashboard = true; // Inizio del caricamento

    this.ngZone.runOutsideAngular(() => {
      this.dashboardService.getDashboardByName(name)
        .then(dashboard => {
          this.ngZone.run(() => {
            this.loadingDashboard = false;
            if (dashboard) {
              this.dashboard = dashboard;
              this.safeHelpDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dashboard.helpDocUrl);
              this.fetchWidgets();
            } else {
              this.errorDashboard = 'Dashboard not found';
            }
          });
        })
        .catch(error => {
          this.ngZone.run(() => {
            this.loadingDashboard = false;
            this.errorDashboard = 'Error fetching dashboard: ' + error;
          });
        });
    });
  }

  private fetchWidgets(): void {
    const widgetIds = this.dashboard?.widgetsInUse || [];

    if (widgetIds.length > 0) {
      this.widgetService.getWidgetsByIdsArray(widgetIds).subscribe(widgets => {
        this.widgetsInUse = widgets;
        console.log('Fetched widgets:', this.widgetsInUse);
        this.addWidgetsToGrid(); // Aggiungi i widget alla griglia
      });
    } else {
      console.log('No widget IDs found in the dashboard.');
    }
  }

  private addWidgetsToGrid(): void {
    this.widgetsInUse.forEach(widget => {
      // Creazione di un elemento div per il widget
      const widgetElement = document.createElement('div');
      widgetElement.id = `item-${widget.id}`; // Assicurati di avere un ID unico per ogni widget
      widgetElement.setAttribute('gs-w', widget.width?.toString() || '1'); // Larghezza del widget
      widgetElement.setAttribute('gs-h', widget.height?.toString() || '1'); // Altezza del widget
      widgetElement.className = 'grid-stack-item'; // Classe per il widget

      // Contenuto del widget
      widgetElement.innerHTML = `
      <div class="grid-stack-item-content">
        <h3>${widget.title}</h3>
        <a href="${widget.url}" target="_blank">Open</a>
      </div `;

      // Aggiungi il widget alla griglia usando makeWidget
      this.gridstackComponent.grid?.makeWidget(widgetElement);
    });
    console.log("Widgets added to grid");
  }

  openHelpDoc(): void {
    console.log("help Doc");
    console.log(this.dashboard?.helpDocUrl);
    this.showHelpDoc = true;
  }

  closeHelpDoc(): void {
    this.showHelpDoc = false;
  }
}
