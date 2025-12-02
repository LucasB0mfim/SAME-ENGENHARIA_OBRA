import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../dynamic-form/dynamic-form.component';
import { HttpClient } from '@angular/common/http';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;
  errorMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      icon: 'scan',
      title: 'Equipamento',
      fields: [
        {
          label: 'ID do Equipamento',
          name: 'id',
          type: 'qrcode',
          placeholder: 'Escaneie o QR Code',
          required: true
        }
      ]
    },
    {
      icon: 'add_location',
      title: 'Origem',
      fields: [
        {
          label: 'Localização Atual',
          name: 'localizacao_origem',
          type: 'geolocation',
          placeholder: 'Clique para obter sua localização',
          required: true
        }
      ]
    },
    {
      icon: 'add_location',
      title: 'Localização',
      fields: [
        {
          label: 'Endereço de Destino',
          name: 'endereco_destino',
          type: 'text',
          placeholder: 'Digite o endereço completo',
          required: true
        }
      ]
    }
  ];

  constructor(
    private readonly _equipamentService: EquipmentService
  ) {}

  onSubmit(formData: FormData): void {
    this.submissionState = FormSubmissionState.LOADING;

    this._equipamentService.checkin(formData)
      .subscribe({
        next: () => {
          this.submissionState = FormSubmissionState.SUCCESS;
          this.submissionState = FormSubmissionState.IDLE;
        },
        error: (error) => {
          this.errorMessage = error.error?.message;
          this.submissionState = FormSubmissionState.ERROR;
        }
      });
  }
}
