import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { EmployeeService } from '../../core/services/employee.service';
import { TaskService } from '../../core/services/task.service';
import { finalize } from 'rxjs';

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

  private readonly taskService = inject(TaskService);
  private readonly employeeService = inject(EmployeeService);

  // ===== ESTADOS ===== //
  currentStep = 1;
  totalSteps = 7;

  employees: any[] = [];
  uploadedFile: File | null = null;

  isSend: boolean = false;
  isError: boolean = false;
  isLoading: boolean = false;

  // ===== FORMULÁRIO ===== //
  createForm = new FormGroup({
    descricao: new FormControl('', Validators.required),
    dataInicial: new FormControl('', Validators.required),
    dataFinal: new FormControl('', Validators.required),
    bonificados: new FormArray([], Validators.required),
    valor_pedreiro: new FormControl('', Validators.required),
    valor_servente: new FormControl('', Validators.required),
  });

  // ===== CICLO DE VIDA ===== //
  ngOnInit(): void {
    this.employeeService.findBasicInfo().subscribe({
      next: (res) => {
        this.employees = res.result;

        const participantes = this.createForm.get('bonificados') as FormArray;
        participantes.clear();
        this.employees.forEach(() => participantes.push(new FormControl(false)));
      },
      error: (err) => {
        console.error('Erro ao carregar colaboradores:', err)
      }
    });
  }

  // ===== SUBMISSÃO ===== //
  onSubmit(): void {
    this.isLoading = true;

    const formData = new FormData();
    const criador = localStorage.getItem('name');
    const centro_custo = localStorage.getItem('centro_custo');

    const participantes = this.createForm.get('bonificados') as FormArray;

    const bonificados = this.employees.filter((_, i) => participantes.at(i).value)
      .map(emp => ({ nome: emp.nome }));

    if (!this.uploadedFile || !criador || !centro_custo) {
      alert('Todos os campos são necessários!');
      return
    }

    formData.append('criador', criador);
    formData.append('centro_custo', centro_custo);

    formData.append('descricao', this.createForm.value.descricao ?? '');
    formData.append('data_inicial', this.createForm.value.dataInicial ?? '');
    formData.append('data_final', this.createForm.value.dataFinal ?? '');
    formData.append('valor_pedreiro', this.createForm.value.valor_pedreiro ?? '');
    formData.append('valor_servente', this.createForm.value.valor_servente ?? '');
    formData.append('bonificados', JSON.stringify(bonificados));

    formData.append('foto_prancheta', this.uploadedFile, this.uploadedFile.name);

    this.taskService.create(formData).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.isSend = true;
        },
        error: (err) => {
          this.isError = true;
          console.error('Erro ao enviar tarefa: ', err)
        }
      });
  }

  // ===== NAVEGAÇÃO ENTRE TELAS ===== //
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  // ===== UPLOAD ===== //
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];
    }
  }
}
