import {Component, OnInit, NgZone, ViewEncapsulation, ViewChild, OnDestroy,Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { WidgetService } from '../../../services/widget/widget.service';
import { Dashboard_interface } from '../../../interfaces/dashboard_interface';
import { Widget_interface } from '../../../interfaces/widget_interface';
import { GridstackModule, NgGridStackOptions, GridstackComponent } from 'gridstack/dist/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MenuDashboardComponent } from '../../common/menu_dashboard/menu-dashboard.component';
import { HtmlcontextService } from '../../../services/htmlcontent/htmlcontext.service'; // Importa il servizio

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridstackModule, MenuDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  public gridOptions: NgGridStackOptions = {
    margin: 10, // Margine tra i widget
    cellHeight: 'auto', // Altezza automatica delle celle
    animate: true, // Abilita animazioni durante i movimenti
    float: true, // Permetti il posizionamento automatico
    minRow: 1, // Numero minimo di righe nella griglia
    resizable: {
      handles: 'all', // Abilita il ridimensionamento
    },
  };


  @ViewChild(GridstackComponent) gridstackComponent!: GridstackComponent; // Reference to the grid

  dashboard: Dashboard_interface | null = null;
  loadingDashboard = true; // Variabile per gestire il caricamento
  errorDashboard: string | null = null;
  widgetsInUse: Widget_interface[] = [];
  showHelpDoc = false;
  safeHelpDocUrl: SafeResourceUrl | null = null;

  // Variabile per isEditable
  isEditable: boolean = false;

  // Variabile per l'orologio
  currentTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dashboardService: DashboardService,
    private widgetService: WidgetService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer, // Inietta DomSanitizer
    private htmlcontextService: HtmlcontextService // Inietta il servizio di decrittazione
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isEditable = params['isEditable'] === 'true';
      console.log('isEditable:', this.isEditable);
    });

    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        if (isPlatformBrowser(this.platformId)) {
          this.fetchDashboard(name);
        } else {
          console.warn('Dashboard rendering is disabled on the server');
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.startClock();
    }
  }


  ngOnDestroy(): void {
    this.widgetsInUse.forEach(widget => {
      const iframe = document.getElementById(`item-${widget.id}`)?.querySelector('iframe');
      if (iframe?.src) {
        URL.revokeObjectURL(iframe.src);
      }
    });
  }

  private startClock(): void {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString(); // Formatta l'ora
    }, 1000); // Aggiorna ogni secondo
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
      const widgetElement = document.createElement('div');
      widgetElement.className = 'grid-stack-item';

      // Decodifica il contenuto del widget
      const decryptedData = this.htmlcontextService.decryptAndSplit(widget.contentHTML);

      if (decryptedData) {
        // Crea un contenitore interno per il widget
        const contentDiv = document.createElement('div');
        contentDiv.className = `grid-stack-item-content widget-${widget.id}`; // Classe univoca per widget
        contentDiv.style.backgroundColor = '#f0f0f0'; // Colore di sfondo personalizzato

        // Applica il CSS decodificato, scoping con classe univoca
        const styleTag = document.createElement('style');
        styleTag.textContent = this.scopeCSS(decryptedData.css, `.widget-${widget.id}`);
        document.head.appendChild(styleTag);

        // Inserisci l'HTML decriptato
        contentDiv.innerHTML = decryptedData.html;

        // Esegui il script JS in un contesto isolato
        if (decryptedData.js) {
          const scriptTag = document.createElement('script');
          scriptTag.textContent = `(function() { ${decryptedData.js} })();`;
          contentDiv.appendChild(scriptTag);
        }

        widgetElement.appendChild(contentDiv);

        // Aggiungi il widget alla griglia con opzioni di auto-posizionamento
        this.gridstackComponent.grid?.makeWidget(widgetElement, {
          w: widget.width || 2,
          h: widget.height || 2,
          autoPosition: true,
        });

        console.log(`Widget ${widget.id} added to grid with scoped CSS and JS`);
      } else {
        console.error(`Failed to decrypt content for widget ${widget.id}`);
      }
    });
  }

  /**
   * Scoping del CSS per renderlo univoco.
   * @param css - Il CSS originale
   * @param scope - La classe o selettore di scoping
   * @returns Il CSS con scoping applicato
   */
  private scopeCSS(css: string, scope: string): string {
    return css
      .split('}')
      .map(rule => {
        const [selectors, declarations] = rule.split('{');
        if (!selectors || !declarations) return '';
        const scopedSelectors = selectors
          .split(',')
          .map(selector => `${scope} ${selector.trim()}`)
          .join(',');
        return `${scopedSelectors} {${declarations}`;
      })
      .join('}');
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
