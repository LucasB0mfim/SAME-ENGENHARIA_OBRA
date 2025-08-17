import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';

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
export class NewTaskComponent {

  private readonly _taskService = inject(LoginService);

  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepFive: boolean = false;

  uploadedFile: { [key: string]: File } = {};

  createForm: FormGroup = new FormGroup({
    nome: new FormControl(''),
    descricao: new FormControl(''),
    participante: new FormControl(''),
    valor_pedreiro: new FormControl(''),
    valor_servente: new FormControl(''),
  });

  onStepOne(): void {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
  }

  onStepTwo(): void {
    this.stepOne = false;
    this.stepTwo = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
  }

  onStepThree(): void {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = true;
    this.stepFour = false;
    this.stepFive = false;
  }

  onStepFour(): void {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = true;
    this.stepFive = false;
  }

  onStepFive(): void {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = true;
  }

  onSubmit(): void {
    const formData = new FormData();

    Object.entries(this.createForm.value).forEach(([key, value]) => {
      formData.append(key, value != null ? String(value) : '');
    });

    Object.entries(this.uploadedFile).forEach(([key, file]) => {
      formData.append(key, file, file.name);
    });

    this._taskService.login(formData).subscribe({

    })
  }

  // ========== MANIPULAR IMAGEM ========== //
  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile['foto_prancheta'] = input.files[0];
    }
  }
}

