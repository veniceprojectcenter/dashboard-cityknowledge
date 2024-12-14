import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dashboard_interface } from '../../../interfaces/dashboard_interface';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-form',
  standalone: true,
  imports: [AutocompleteComponent, ReactiveFormsModule, FormsModule, NgIf, NgClass],
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.css']
})
export class DashboardFormComponent implements OnInit {
  private _input: string | null = null;

  @Input()
  set input(value: string | null) {
    this._input = value;
    if (this._input) {
      this.loadDashboardData(this._input);
    }
  }

  get input(): string | null {
    return this._input;
  }

  dashboardData: Dashboard_interface | null = null;
  dashboardForm: FormGroup;
  selectedWidgetIds: string[] = [];
  currentStep: number = 1;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(private _dashboardService: DashboardService, private fb: FormBuilder) {
    // Initialize the form group
    this.dashboardForm = this.fb.group({
      name: ['', Validators.required],
      pageTitle: ['', Validators.required],
      helpDocUrl: ['', [Validators.required, Validators.pattern('^(https?:\\/\\/)?' +
        '((([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\\.)+[a-z]{2,}|' +
        'localhost|' +
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +
        '\\[?[a-f0-9]*:[a-f0-9:%.~]*\\]?)' +
        '(\\:\\d+)?(\\/[-a-z0-9+&@#/%=~_|$?!:.]*[a-z0-9+&@#/%=~_|$])?$')]],
      helpDocHeight: [1, [Validators.required, Validators.min(1)]],
      helpDocWidth: [1, [Validators.required, Validators.min(1)]],
      coordX: [0, [Validators.required]],
      coordY: [0, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Initial log to debug
    console.log('DashboardFormComponent initialized with input:', this.input);

    if (this.input) {
      this.loadDashboardData(this.input);
    }
  }

  private loadDashboardData(dashboardName: string): void {
    console.log('Loading dashboard data for:', dashboardName);

    this._dashboardService.getDashboardByName(dashboardName).then(dashboard => {
      if (dashboard) {
        console.log('Dashboard found:', dashboard);
        this.selectedWidgetIds = dashboard.widgetsInUse;

        // Populate the form with dashboard data
        this.dashboardForm.patchValue({
          name: dashboard.name,
          pageTitle: dashboard.pageTitle,
          helpDocUrl: dashboard.helpDocUrl,
          helpDocHeight: dashboard.helpDocHeight,
          helpDocWidth: dashboard.helpDocWidth,
          coordX: dashboard.coords[0],
          coordY: dashboard.coords[1],
        });
      } else {
        console.warn('No dashboard found with name:', dashboardName);
      }
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
    });
  }

  nextStep(): void {
    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  async onSubmit(): Promise<void> {
    if (this.dashboardForm.valid && this.selectedWidgetIds.length > 0) {
      const formValues = this.dashboardForm.value;

      // Check if the dashboard already exists
      const existingDashboard = await this._dashboardService.getDashboardByName(formValues.name);

      if (!this.input && existingDashboard) {
        // If the dashboard exists, show an error message
        this.message = 'A dashboard with this name already exists. Please choose a different name.';
        this.messageType = 'error';
      } else {
        // If the dashboard does not exist, create a new one
        this.dashboardData = {
          name: formValues.name,
          helpDocUrl: formValues.helpDocUrl,
          helpDocWidth: formValues.helpDocWidth,
          helpDocHeight: formValues.helpDocHeight,
          pageTitle: formValues.pageTitle,
          coords: [formValues.coordX, formValues.coordY], // Construct coords
          widgetsInUse: this.selectedWidgetIds, // Include selected widgets
        } as Dashboard_interface;

        try {
          await this._dashboardService.addDashboard(this.dashboardData);
          if(this.input){
            this.message = 'Dashboard edited successfully.';
          }else {
            this.message = 'Dashboard created successfully!';
          }
          this.messageType = 'success';
        } catch (error) {
          console.error('Error:', error);
          this.message = 'Failed to create dashboard. Please try again.';
          this.messageType = 'error';
        }

      }
      // Reset the form after submitting
      if(!this.input) {
        this.dashboardForm.reset();
        this.selectedWidgetIds = [];
      }

    } else {
      this.message = 'Please fill in all required fields and select widgets.';
      this.messageType = 'error';
    }
    this.currentStep = 2;

    // Reset the message after a timeout (5 seconds)
    this.resetMessageAfterTimeout();
  }

  private resetMessageAfterTimeout(): void {
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 5000); // Remove message after 5 seconds
  }

  onWidgetsSelected(widgetIds: string[]): void {
    this.selectedWidgetIds = widgetIds;
  }
}
