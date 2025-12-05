import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterEquipamentComponent {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;
  qrCode: string = ''; // Para armazenar o QR Code retornado

  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Nome',
          name: 'nome',
          type: 'text',
          placeholder: 'Ex: Motovibrador',
          required: true
        }
      ],
    },
    {
      fields: [
        {
          label: 'Foto',
          name: 'foto',
          type: 'file',
          required: true
        }
      ],
    }
  ];

  constructor(
    private readonly _equipamentService: EquipmentService
  ) { }

  onSubmit(formData: FormData): void {
    this.submissionState = FormSubmissionState.LOADING;
    this._equipamentService.register(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.qrCode = res.qrCode || ''; // Assumindo que o backend retorna o qrCode
        this.submissionState = FormSubmissionState.SUCCESS;
      },
      error: (error) => {
        this.errorMessage = error.error?.message;
        this.submissionState = FormSubmissionState.ERROR;
      }
    });
  }
}
