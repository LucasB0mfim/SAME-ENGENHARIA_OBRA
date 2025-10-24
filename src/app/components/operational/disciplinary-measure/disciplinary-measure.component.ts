import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { DisciplinaryMeasureService } from '../../../core/services/disciplinary-measure.service';

@Component({
  selector: 'app-disciplinary-measure',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './disciplinary-measure.component.html',
  styleUrl: './disciplinary-measure.component.scss'
})
export class DisciplinaryMeasureComponent implements OnInit {

  private readonly _userService = inject(UserService);
  private readonly _employeesService = inject(EmployeesService);
  private readonly _disciplinaryMeasureService = inject(DisciplinaryMeasureService);

  currentStep = 1;
  totalSteps = 4;

  userData: any = null;
  employees: any = {};

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  successIllustration: string = 'assets/images/success.png';
  serverErrorIllustration: string = 'assets/images/error.png';

  createForm = new FormGroup({
    colaborador: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
    data_ocorrido: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.findUser();
    this.findAciveEmployees();
  };

  findUser(): void {
    this._userService.getInfo()
      .subscribe({
        next: (res) => { this.userData = res.result },
        error: (err) => { console.error(err.error.message) }
      });
  };

  findAciveEmployees(): void {
    this._employeesService.findActiveNames()
      .subscribe({
        next: (res) => { this.employees = res.result },
        error: (err) => { console.error(err.error.message) }
      });
  };

  onSubmit(): void {
    this.isLoading = true;

    const request = {
      criador: this.userData.nome,
      motivo: this.createForm.value.motivo,
      colaborador: this.createForm.value.colaborador,
      data_ocorrido: this.createForm.value.data_ocorrido
    }

    this._disciplinaryMeasureService.create(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.isSuccess = true;
        },
        error: (err) => {
          this.isServerError = true;
          console.error(err.error.message);
        }
      });
  };

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  };

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  };
}
