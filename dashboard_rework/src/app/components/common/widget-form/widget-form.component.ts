import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HtmlcontextService } from '../../../services/htmlcontent/htmlcontext.service';
import { WidgetService } from '../../../services/widget/widget.service';
import { NgIf } from '@angular/common';
import { WidgetPreviewComponent } from '../widget-preview/widget-preview.component';
import {Widget_interface} from '../../../interfaces/widget_interface';

@Component({
  selector: 'app-widget-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    WidgetPreviewComponent
  ],
  templateUrl: './widget-form.component.html',
  styleUrl: './widget-form.component.css'
})
export class WidgetFormComponent implements OnInit {
  widgetDetailsForm: FormGroup;
  contentHTMLForm: FormGroup;
  dimensionsForm: FormGroup;
  urlsForm: FormGroup;
  previewData: string = '';
  currentStep = 1;
  createdWidget: any = null;

  @Input() widgetId: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private htmlcontextService: HtmlcontextService,
              private widgetService: WidgetService) {

    // Initialize the forms
    this.widgetDetailsForm = this.formBuilder.group({
      title: ['', Validators.required],
      id: ['', Validators.required],
    });

    this.contentHTMLForm = this.formBuilder.group({
      contentHTML: ['', Validators.required],
    });

    this.dimensionsForm = this.formBuilder.group({
      height: [2, [Validators.required, Validators.min(1)]],
      width: [2, [Validators.required, Validators.min(1)]],
    });

    this.urlsForm = this.formBuilder.group({
      helpDocUrl: ['', [Validators.required, Validators.pattern(this.getUrlPattern())]],
      url: ['', [Validators.required, Validators.pattern(this.getUrlPattern())]],
      urlTitle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Populate form if widgetId is provided
    if (this.widgetId) {
      this.widgetDetailsForm.get('id')?.disable();
      this.loadWidgetData(this.widgetId);
    }
  }

  // Load widget data by ID and populate forms
  private loadWidgetData(widgetId: string): void {
    this.widgetService.getWidgetByName(widgetId).then(widget => {
      if (widget) {
        // Decrypt the contentHTML if applicable
        const decryptedContent = this.htmlcontextService.decryptAndSplit(widget.contentHTML);
        this.previewData = widget.contentHTML;
        // Fill the forms with the widget data
        this.widgetDetailsForm.patchValue({
          title: widget.title,
          id: widget.id
        });

        this.contentHTMLForm.patchValue({
          contentHTML: decryptedContent // Use decrypted content if available
        });
        this.dimensionsForm.patchValue({
          height: widget.height,
          width: widget.width
        });

        this.urlsForm.patchValue({
          helpDocUrl: widget.helpDocUrl,
          url: widget.url,
          urlTitle: widget.urlTitle
        });
      } else {
        console.error('No widget found with the given ID.');
      }
    }).catch(error => {
      console.error('Error loading widget data:', error);
    });
  }

  nextStep() {
    if (this.isCurrentFormValid()) {
      this.currentStep++;
    }
  }

  prevStep() {
    this.currentStep--;
  }

  isCurrentFormValid(): boolean {
    if (this.currentStep === 1) return this.widgetDetailsForm.valid;
    if (this.currentStep === 2) return this.contentHTMLForm.valid;
    if (this.currentStep === 3) return this.dimensionsForm.valid;
    if (this.currentStep === 4) return this.urlsForm.valid;
    return false;
  }

  updatePreviewData(data: string): void {
    const decrypt = this.htmlcontextService.decryptAndSplit(data);

    if (!decrypt || typeof decrypt !== 'object') {
      console.error('Decryption failed or returned an invalid result.');
      this.contentHTMLForm.patchValue({ contentHTML: null });
      this.contentHTMLForm.get('contentHTML')?.setErrors({ invalid: true });
      return;
    }

    if (decrypt.html.trim() === '' && decrypt.css.trim() === '' && decrypt.js.trim() === '') {
      this.contentHTMLForm.patchValue({ contentHTML: null });
      this.contentHTMLForm.get('contentHTML')?.setErrors({ invalid: true });
    } else {
      this.previewData = data;
      this.contentHTMLForm.patchValue({ contentHTML: decrypt });
    }
    console.log(this.contentHTMLForm.valid);
  }

  submitWidget() {
    const isWidgetDetailsValid = this.widgetDetailsForm.valid;
    const isContentHTMLValid = this.contentHTMLForm.valid;
    const isDimensionsValid = this.dimensionsForm.valid;
    const isUrlsValid = this.urlsForm.valid;

    const formId = this.widgetDetailsForm.getRawValue().id;

    if (isWidgetDetailsValid && isContentHTMLValid && isDimensionsValid && isUrlsValid) {
      const widgetId = this.widgetDetailsForm.value.id;

      // Check if the widget already exists
      this.widgetService.getWidgetByName(widgetId).then(existingWidget => {
        if (!this.widgetId && existingWidget) {
          alert('Widget already exists. Please choose a different ID.');
        } else {
          // Encrypt HTML, CSS, and JS before saving
          const { html, css, js } = this.contentHTMLForm.value.contentHTML; // Assuming contentHTML is split
          const encryptedContent = this.htmlcontextService.combineAndEncrypt(html, css, js);

          // Create the widget with encrypted content
          this.createdWidget = {
            id: formId,
            title: this.widgetDetailsForm.value.title,
            contentHTML: encryptedContent, // Save the encrypted string
            height: this.dimensionsForm.value.height,
            width: this.dimensionsForm.value.width,
            helpDocUrl: this.urlsForm.value.helpDocUrl,
            url: this.urlsForm.value.url,
            urlTitle: this.urlsForm.value.urlTitle,
          } as Widget_interface;

          this.widgetService.addWidget(this.createdWidget).then(() => {
            if(!this.widgetId) {
              this.resetForms();
              console.log('Widget Created:', this.createdWidget);
              alert('Widget created successfully!');
            }else{
              console.log('Widget edited:', this.createdWidget);
              alert('Widget edited successfully!');
            }
          }).catch(error => {
            console.error('Error creating widget:', error);
            alert('Failed to create widget. Please try again.');
          });
        }
      }).catch(error => {
        console.error('Error checking widget existence:', error);
        alert('An error occurred while checking widget existence. Please try again.');
      });
    } else {
      alert('Please ensure all fields are filled correctly.');
    }
  }


  private resetForms(): void {
    this.widgetDetailsForm.reset();
    this.contentHTMLForm.reset();
    this.previewData = '';
    this.dimensionsForm.reset({ height: 2, width: 2 });
    this.urlsForm.reset();
  }

  // Get URL pattern to validate URLs
  private getUrlPattern(): string {
    return `^(https?:\\/\\/)?` + // Schema (optional)
      `((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|` + // Domain name
      `(localhost)|` + // Localhost
      `((\\d{1,3}\\.){3}\\d{1,3})|` + // IPv4
      `(\\[[a-fA-F0-9:.]+\\])` + // IPv6
      `)(:\\d+)?(\\/[-a-zA-Z0-9@:%._\\+~#=]*)*` + // Port and path (optional)
      `(\\?[;&a-zA-Z0-9%._\\+~#=]*)?` + // Query string (optional)
      `(\\#[-a-zA-Z0-9@:%._\\+~#=]*)?$`; // Fragment (optional)
  }
}
