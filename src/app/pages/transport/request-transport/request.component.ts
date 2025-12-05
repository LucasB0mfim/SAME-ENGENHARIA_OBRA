import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../core/services/user.service';
import { TransportService } from '../../../core/services/transport.service';

@Component({
  selector: 'app-request',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss'
})
export class RequestComponent implements OnInit {

  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  errorMessage: string = '';
  successMessage: string = '';

  // Configuração do formulário de check-in
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
          placeholder: 'Ex: Não tenho veículo próprio',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Viagens de ônibus por dia',
          name: 'qtd_onibus',
          type: 'number',
          min: 0,
          max: 10,
          placeholder: 'Ex: 2',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Viagens de metrô por dia',
          name: 'qtd_metro',
          type: 'number',
          min: 0,
          max: 10,
          placeholder: 'Ex: 1',
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
    formData.append('tipo', 'SOLICITACAO');

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
