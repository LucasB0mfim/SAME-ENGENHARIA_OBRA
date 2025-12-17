import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'ID do equipamento',
          name: 'id',
          type: 'qrcode',
          placeholder: 'Escaneie o QR Code',
          required: true
        }
      ],
    },
    {
      fields: [
        {
          label: 'Localização',
          name: 'origem',
          type: 'geolocation',
          placeholder: 'Clique para obter sua localização',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Destino',
          name: 'destino',
          type: 'select',
          options: ['Same Engenharia', 'Fornecedor'],
          required: true
        }
      ]
    }
  ];

  constructor(
    private readonly _equipamentService: EquipmentService
  ) { }

  onSubmit(formData: FormData): void {
    this.submissionState = FormSubmissionState.LOADING;
    this._equipamentService.checkout(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submissionState = FormSubmissionState.SUCCESS;
      },
      error: (error) => {
        this.errorMessage = error.error?.message;
        this.submissionState = FormSubmissionState.ERROR;
      }
    });
  }
}
