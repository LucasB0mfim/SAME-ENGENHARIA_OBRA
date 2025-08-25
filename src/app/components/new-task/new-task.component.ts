import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EmployeesService } from '../../core/services/employees.service';
import { TaskService } from '../../core/services/task.service';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-new-task',
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly _employeesService = inject(EmployeesService);
  private readonly _employeeService = inject(EmployeeService);

  employeeInfo: any = null;

  currentStep = 1;
  totalSteps = 7;
  employees: any[] = [];
  selectedEmployeeFunctions: string[] = [];
  uploadedFile: File | null = null;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isNotFound: boolean = false;
  isServerError: boolean = false;

  successIllustration: string = 'assets/images/success.png';
  notFoundIllustration: string = 'assets/images/notFound.png';
  serverErrorIllustration: string = 'assets/images/serverError.png';

  createForm = new FormGroup({
    descricao: new FormControl('', Validators.required),
    dataInicial: new FormControl('', Validators.required),
    dataFinal: new FormControl('', Validators.required),
    bonificados: new FormArray([]),
    valores_funcoes: new FormArray([])
  });

  ngOnInit(): void {
    this._employeesService.findBasicInfo().subscribe({
      next: (res) => {
        this.employees = res.result;
        const participantes = this.createForm.get('bonificados') as FormArray;
        participantes.clear();
        this.employees.forEach(() => participantes.push(new FormControl(false)));
      },
      error: (err) => console.error('Erro ao carregar colaboradores:', err)
    });

    this._employeeService.getInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.employee;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do colaborador: ', err);
      }
    });
  }

  getSelectedEmployeeFunctions(): string[] {
    const participantes = this.createForm.get('bonificados') as FormArray;
    const selectedEmployees = this.employees.filter((_, i) => participantes.at(i).value);
    return [...new Set(selectedEmployees.map(emp => emp.funcao))];
  }

  updateFunctionFields(): void {
    this.selectedEmployeeFunctions = this.getSelectedEmployeeFunctions();
    const valoresFuncoesArray = this.createForm.get('valores_funcoes') as FormArray;

    valoresFuncoesArray.clear();

    this.selectedEmployeeFunctions.forEach(funcao => {
      valoresFuncoesArray.push(new FormGroup({
        funcao: new FormControl(funcao, Validators.required),
        valor: new FormControl('', [Validators.required, Validators.min(0)])
      }));
    });

    this.totalSteps = 4 + this.selectedEmployeeFunctions.length + 1;
  }

  getCurrentFunctionStep(): string | null {
    if (this.currentStep <= 4 || this.currentStep > 4 + this.selectedEmployeeFunctions.length) return null;
    return this.selectedEmployeeFunctions[this.currentStep - 5];
  }

  getBonificadoControl(index: number): FormControl {
    return (this.createForm.get('bonificados') as FormArray).controls[index] as FormControl;
  }

  getValorFuncaoControl(index: number): FormControl {
    return (this.createForm.get('valores_funcoes') as FormArray).controls[index].get('valor') as FormControl;
  }

  onSubmit(): void {
    this.isLoading = true;
    const formData = new FormData();
    const criador = localStorage.getItem('name');
    const centro_custo = localStorage.getItem('centro_custo');

    const participantes = this.createForm.get('bonificados') as FormArray;
    const bonificados = this.employees
      .filter((_, i) => participantes.at(i).value)
      .map(emp => ({ nome: emp.nome, funcao: emp.funcao }));

    if (!this.uploadedFile || !criador || !centro_custo || !bonificados.length) {
      alert('Todos os campos são necessários!');
      this.isLoading = false;
      return;
    }

    formData.append('criador', this.employeeInfo?.name);
    formData.append('centro_custo', 'ESCRITÓRIO');
    formData.append('descricao', this.createForm.value.descricao ?? '');
    formData.append('data_inicial', this.createForm.value.dataInicial ?? '');
    formData.append('data_final', this.createForm.value.dataFinal ?? '');

    const valoresFuncoes = this.createForm.value.valores_funcoes?.map((item: any) => ({
      funcao: item.funcao,
      valor: Number(item.valor)
    })) ?? [];
    formData.append('valores_funcoes', JSON.stringify(valoresFuncoes));
    formData.append('bonificados', JSON.stringify(bonificados));
    formData.append('foto_prancheta', this.uploadedFile, this.uploadedFile.name);

    this.taskService.create(formData).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.isSuccess = true;
      },
      error: (err) => {
        if (err.status === 404) {
          this.isServerError = true;
        } else {
          this.isServerError = true;
        }
      }
    });
  }

  nextStep(): void {
    if (this.currentStep === 4) {
      this.updateFunctionFields();
      const participantes = this.createForm.get('bonificados') as FormArray;
      if (!participantes.controls.some(control => control.value)) {
        alert('Selecione pelo menos um colaborador!');
        return;
      }
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.uploadedFile = input.files[0];
  }
}
