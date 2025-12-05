import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../core/services/user.service';
import { TransportService } from '../../../core/services/transport.service';

@Component({
  selector: 'app-cancel-transport',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './cancel-transport.component.html',
  styleUrl: './cancel-transport.component.scss'
})
export class CancelTransportComponent implements OnInit {
submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  errorMessage: string = '';

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
    formData.append('tipo', 'CANCELAMENTO');

    this._transportService.create(formData)
      .subscribe({
        next: () => {
          this.submissionState = FormSubmissionState.SUCCESS;
          this.submissionState = FormSubmissionState.IDLE;
        },
        error: (error) => {
          console.error('Erro ao realizar cancelamento:', error);
          this.errorMessage = error.error?.message;
          this.submissionState = FormSubmissionState.ERROR;
        }
      });
  }
}
