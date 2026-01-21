import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState, SelectListItem } from '../../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../../core/services/user.service';
import { EmployeesService } from '../../../../core/services/employees.service';
import { DisciplinaryMeasureService } from '../../../../core/services/disciplinary-measure.service';

@Component({
  selector: 'app-task-register',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './task-register.component.html',
  styleUrl: './task-register.component.scss'
})
export class TaskRegisterComponent implements OnInit {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  employeesList: any[] = [];
  costCenterList: any[] = [];

  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Tarefa',
          name: 'descricao',
          type: 'text',
          placeholder: 'Insira o descrição da tarefa',
          required: true
        }
      ],
    },
    {
      fields: [
        {
          label: 'Colaboradores',
          name: 'colaboradores',
          type: 'select-list',
          options: [], // Será preenchido dinamicamente
          required: false
        }
      ]
    },
    {
      fields: [
        {
          label: 'Centro de custo',
          name: 'centro_custo',
          type: 'select',
          options: [], // Será preenchido dinamicamente
          placeholder: 'Insira o centro de custo',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Início da atividade',
          name: 'data_inicial',
          type: 'date',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Fim da atividade',
          name: 'data_final',
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
    this.getActiveCostCenters();
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
    this._employeesService.findActiveNames().subscribe({
      next: (res) => {
        this.employeesList = res.result;

        const colaboradorField = this.formSections[1].fields.find(f => f.name === 'colaboradores');
        if (colaboradorField) {
          colaboradorField.options = this.employeesList;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getActiveCostCenters(): void {
    this._employeesService.findActiveCostCenters().subscribe({
      next: (res) => {
        this.costCenterList = res.result;

        const costCenterField = this.formSections[2].fields.find(f => f.name === 'centro_custo');
        if (costCenterField) {
          costCenterField.options = this.costCenterList;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit(formData: FormData): void {
    formData.append('criado_por', this.userData.nome);

    // Exemplo de como acessar os dados dos colaboradores
    const colaboradoresJson = formData.get('colaboradores') as string;
    if (colaboradoresJson) {
      const colaboradores: SelectListItem[] = JSON.parse(colaboradoresJson);
      console.log('Colaboradores selecionados:', colaboradores);
      // colaboradores será um array como: [{nome: "JOÃO PEDRO", valor: 200}, {nome: "LUCAS", valor: 1250}]
    }

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
