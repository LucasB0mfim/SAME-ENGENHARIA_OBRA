import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../core/services/user.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { DisciplinaryMeasureService } from '../../../core/services/disciplinary-measure.service';

@Component({
  selector: 'app-disciplinary-measure',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './disciplinary-measure.component.html',
  styleUrl: './disciplinary-measure.component.scss'
})
export class DisciplinaryMeasureComponent implements OnInit {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  employeesList: any[] = [];

  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Colaborador',
          name: 'colaborador',
          type: 'select',
          options: [],
          required: true
        }
      ],
    },
    {
      fields: [
        {
          label: 'Motivo',
          name: 'motivo',
          type: 'text',
          placeholder: 'Insira o motivo',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Data do ocorrido',
          name: 'data_ocorrido',
          type: 'date',
          required: true
        }
      ]
    }
  ];

  constructor(
    private readonly _disciplinaryMeasureService: DisciplinaryMeasureService,
    private readonly _userService: UserService,
    private readonly _employeesService: EmployeesService
  ) { }

  onFormStateChange(newState: FormSubmissionState): void {
    this.submissionState = newState;
  }

  ngOnInit(): void {
    this.getUser();
    this.getActiveEmployees();
  }

  getUser(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getActiveEmployees(): void {
    this._employeesService.findAllNames().subscribe({
      next: (res) => {
        if (res.success && res.result) {
          // Atualiza diretamente a seção do formulário
          this.formSections[0].fields[0].options = res.result;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar colaboradores:', error);
      }
    });
  }

  onSubmit(formData: FormData): void {
    formData.append('criado_por', this.userData.nome);

    this.submissionState = FormSubmissionState.LOADING;
    this._disciplinaryMeasureService.create(formData).subscribe({
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
