import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../core/services/user.service';
import { TransportService } from '../../../core/services/transport.service';

@Component({
  selector: 'app-cancel',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss'
})
export class CancelComponent implements OnInit {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Endereço completo',
          name: 'endereco',
          type: 'text',
          placeholder: 'Ex: Rua Arthur Lopes, 218',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Motivo do pedido',
          name: 'motivo',
          type: 'text',
          placeholder: 'Ex: Venho de carona',
          required: true
        }
      ]
    }
  ];

  constructor(
    private _transportService: TransportService,
    private _userService: UserService
  ) { }

  onFormStateChange(newState: FormSubmissionState): void {
    this.submissionState = newState;
  }

  ngOnInit(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (err) => {
        console.error(err.error.message);
      }
    });
  };

  onSubmit(formData: FormData): void {
    formData.append('chapa', this.userData.chapa);
    formData.append('tipo', 'CANCELAMENTO');

    this.submissionState = FormSubmissionState.LOADING;
    this._transportService.create(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submissionState = FormSubmissionState.SUCCESS;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao registrar medida disciplinar';
        this.submissionState = FormSubmissionState.ERROR;
      }
    });
  }
}
