import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { EmployeeService } from '../../core/services/employee.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-new-task',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent implements OnInit {

  ngOnInit(): void {
    this.getEmployees();
  }

  private readonly _taskService = inject(TaskService);
  private readonly _employeeService = inject(EmployeeService);

  currentStep: number = 1;
  totalSteps: number = 5;

  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';

  uploadedFile: File | null = null;

  createForm: FormGroup = new FormGroup({
    descricao: new FormControl('', Validators.required),
    participante: new FormArray([], Validators.required),
    valor_pedreiro: new FormControl('', Validators.required),
    valor_servente: new FormControl('', Validators.required),
    foto_prancheta: new FormControl(null, Validators.required)
  });

  get participanteFormArray(): FormArray {
    return this.createForm.get('participante') as FormArray;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    const formData = new FormData();

    const selectedEmployees = this.getSelectedEmployees();

    Object.entries(this.createForm.value).forEach(([key, value]) => {
      if (key !== 'foto_prancheta' && key !== 'participante') {
        formData.append(key, value != null ? String(value) : '');
      }
    });

    formData.append('participante', JSON.stringify(selectedEmployees));

    if (this.uploadedFile) {
      formData.append('foto_prancheta', this.uploadedFile, this.uploadedFile.name);
    }

    const email = localStorage.getItem('email');
    if (email) {
      formData.append('email', email);
    }

    this._taskService.create(formData).subscribe({
      next: (res) => {
        console.log('Enviado com sucesso', res);
      },
      error: (err) => {
        console.error('Erro ao enviar', err);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      this.createForm.patchValue({ foto_prancheta: this.uploadedFile });
      this.createForm.get('foto_prancheta')?.updateValueAndValidity();
    }
  }

  getFileName(): string {
    return this.uploadedFile ? this.uploadedFile.name : 'Clique aqui para anexar a imagem';
  }

  getEmployees(): void {
    console.log('Chamando getEmployees...');
    this._employeeService.findBasicInfo().subscribe({
      next: (res) => {
        console.log('Resposta da API:', res);
        this.employees = res.result;
        this.filteredEmployees = [...this.employees];
        this.initializeparticipanteFormArray();
      },
      error: (err) => {
        console.error('Erro ao carregar colaboradores:', err);
      }
    });
  }

  initializeparticipanteFormArray(): void {
    const participanteArray = this.participanteFormArray;
    participanteArray.clear();

    this.employees.forEach(() => {
      participanteArray.push(new FormControl(false));
    });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value || '';
    console.log('Search term:', this.searchTerm);
    this.filterEmployees();
  }

  filterEmployees(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
    } else {
      this.filteredEmployees = this.employees.filter(emp =>
        emp.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getEmployeeIndex(employee: any): number {
    return this.employees.findIndex(emp => emp.nome === employee.nome);
  }

  isEmployeeSelected(employee: any): boolean {
    const index = this.getEmployeeIndex(employee);
    return index !== -1 ? this.participanteFormArray.at(index).value : false;
  }

  toggleEmployeeSelection(employee: any): void {
    const index = this.getEmployeeIndex(employee);
    if (index !== -1) {
      const currentValue = this.participanteFormArray.at(index).value;
      this.participanteFormArray.at(index).setValue(!currentValue);
    }
  }

  getSelectedEmployees(): string[] {
    const selectedEmployeeNames: string[] = [];
    this.participanteFormArray.controls.forEach((control, index) => {
      if (control.value && this.employees[index]) {
        selectedEmployeeNames.push(this.employees[index].nome);
      }
    });
    return selectedEmployeeNames;
  }
}

