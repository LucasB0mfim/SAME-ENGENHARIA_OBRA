import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../core/services/user.service';
import { TransportService } from '../../../core/services/transport.service';

@Component({
  selector: 'app-request-transport',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './request-transport.component.html',
  styleUrl: './request-transport.component.scss'
})
export class RequestTransportComponent implements OnInit {

  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  errorMessage: string = '';

  // Configuração do formulário de check-in
  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Seu endereço',
          name: 'endereco',
          type: 'text',
          placeholder: 'Rua Arthur Lopes, 218',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Motivo da solicitação',
          name: 'motivo',
          type: 'textarea',
          placeholder: 'Informe o motivo da solicitação',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Ônibus por dia',
          name: 'qtd_onibus',
          type: 'number',
          min: 0,
          max: 10,
          placeholder: '0',
          required: true
        },
        {
          label: 'Metrô por dia',
          name: 'qtd_metro',
          type: 'number',
          min: 0,
          max: 10,
          placeholder: '0',
          required: true
        }
      ]
    }
  ];

  constructor(
    private _transportService: TransportService,
    private _userService: UserService
  ) {}

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
    this.submissionState = FormSubmissionState.LOADING;

    formData.append('chapa', this.userData.chapa);
    formData.append('tipo', 'SOLICITACAO');

    this._transportService.create(formData)
      .subscribe({
        next: () => {
          this.submissionState = FormSubmissionState.SUCCESS;
          this.submissionState = FormSubmissionState.IDLE;
        },
        error: (error) => {
          console.error('Erro ao realizar check-in:', error);
          this.errorMessage = error.error?.message;
          this.submissionState = FormSubmissionState.ERROR;
        }
      });
  }
}
