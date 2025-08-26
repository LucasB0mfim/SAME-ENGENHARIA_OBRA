import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { TaskService } from '../../core/services/task.service';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeesService } from '../../core/services/employees.service';

@Component({
  selector: 'app-new-task',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  // ===== INJEÇÃO DE DEPENDÊNCIAS ===== //
  private readonly _taskService = inject(TaskService);
  private readonly _employeeService = inject(EmployeeService);
  private readonly _employeesService = inject(EmployeesService);

  // ===== ESTADOS ===== //
  employees: any[] = [];
  costCenter: any = null;
  employeeInfo: any = null;

  currentStep = 1;
  totalSteps = 7;

  uploadedFile: File | null = null;
  selectedEmployeeFunctions: string[] = [];

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  successIllustration: string = 'assets/images/task.png';
  serverErrorIllustration: string = 'assets/images/serverError.png';

  // ===== FORMULÁRIO ===== //
  createForm = new FormGroup({
    descricao: new FormControl('', [Validators.required, Validators.minLength(2)]),
    centroCusto: new FormControl('', Validators.required),
    dataInicial: new FormControl('', Validators.required),
    dataFinal: new FormControl('', Validators.required),
    bonificados: new FormArray([], Validators.required),
    valoresFuncoes: new FormArray([], Validators.required)
  });

  // ===== HOOK ===== //
  ngOnInit(): void {
    this.getEmployeesInfo();
    this.getUserInfo();
  }

  // ===== BUSCAR INFORMAÇÕES DOS COABORADORES ===== //
  getEmployeesInfo(): void {
    this._employeesService.findBasicInfo().subscribe({
      next: (res) => {
        this.employees = res.result;

        this.costCenter = [
          ...new Set(this.employees.map((emp) => emp.centro_custo))
        ];

        const participantes = this.createForm.get('bonificados') as FormArray;
        participantes.clear();
        this.employees.forEach(() => participantes.push(new FormControl(false)));
      },
      error: (err) => {
        this.isServerError = true;
        console.error('Erro ao carregar colaboradores: ', err);
      }
    });
  }

  // ===== BUSCAR INFORMAÇÕES DO USUÁRIO ===== //
  getUserInfo(): void {
    this._employeeService.getInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.employee;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do colaborador: ', err);
      }
    });
  }

  // ===== ENVIAR FORMULÁRIO ===== //
  onSubmit(): void {
    this.isLoading = true;


    const participantes = this.createForm.get('bonificados') as FormArray;

    const bonificados = this.employees
      .filter((_, i) => participantes.at(i).value)
      .map(emp => ({ nome: emp.nome, funcao: emp.funcao }));

    if (!this.uploadedFile) {
      alert('O envio da foto é obrigatório!');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('criador', this.employeeInfo?.name);
    formData.append('centro_custo', this.createForm.value.centroCusto ?? '');
    formData.append('descricao', this.createForm.value.descricao ?? '');
    formData.append('data_inicial', this.createForm.value.dataInicial ?? '');
    formData.append('data_final', this.createForm.value.dataFinal ?? '');

    const valoresFuncoes = this.createForm.value.valoresFuncoes?.map((item: any) => ({
      funcao: item.funcao,
      valor: Number(item.valor)
    })) ?? [];

    formData.append('valores_funcoes', JSON.stringify(valoresFuncoes));
    formData.append('bonificados', JSON.stringify(bonificados));
    formData.append('foto_prancheta', this.uploadedFile, this.uploadedFile.name);

    this._taskService.create(formData).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.isSuccess = true;
      },
      error: (err) => {
        this.isServerError = true;
        console.error('Erro ao enviar tarefa: ', err);
      }
    });
  }

  // ===== AVANÇAR UMA TELA ===== //
  nextStep(): void {
    if (this.currentStep === 5) {
      this.updateFunctionFields();
      const participantes = this.createForm.get('bonificados') as FormArray;

      if (!participantes.controls.some(control => control.value)) {
        alert('Selecione pelo menos um colaborador!');
        return;
      }
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  // ===== VOLTAR UMA TELA ===== //
  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  // ===== CAPTURAR IMAGEM ===== //
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.uploadedFile = input.files[0];
  }

  // ===== MÉTODO PARA CAPTURAR FUNÇÃO E VALOR DO COLABORADOR ===== //
  getSelectedEmployeeFunctions(): string[] {
    const participantes = this.createForm.get('bonificados') as FormArray;
    const selectedEmployees = this.employees.filter((_, i) => participantes.at(i).value);
    return [...new Set(selectedEmployees.map(emp => emp.funcao))];
  }

  updateFunctionFields(): void {
    this.selectedEmployeeFunctions = this.getSelectedEmployeeFunctions();
    const valoresFuncoesArray = this.createForm.get('valoresFuncoes') as FormArray;

    valoresFuncoesArray.clear();

    this.selectedEmployeeFunctions.forEach(funcao => {
      valoresFuncoesArray.push(new FormGroup({
        funcao: new FormControl(funcao, Validators.required),
        valor: new FormControl('', [Validators.required, Validators.min(0)])
      }));
    });

    this.totalSteps = 5 + this.selectedEmployeeFunctions.length + 1;
  }

  getCurrentFunctionStep(): string | null {
    if (this.currentStep <= 5 || this.currentStep > 5 + this.selectedEmployeeFunctions.length) {
      return null
    };

    return this.selectedEmployeeFunctions[this.currentStep - 6];
  }

  getBonificadoControl(index: number): FormControl {
    return (this.createForm.get('bonificados') as FormArray).controls[index] as FormControl;
  }

  getValorFuncaoControl(index: number): FormControl {
    return (this.createForm.get('valoresFuncoes') as FormArray).controls[index].get('valor') as FormControl;
  }
}
