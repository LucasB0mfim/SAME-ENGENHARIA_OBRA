import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { EquipmentRentalService } from '../../core/services/equipment-rental.service';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-equipment-rental',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './equipment-rental.component.html',
  styleUrl: './equipment-rental.component.scss'
})
export class EquipmentRentalComponent implements OnInit {

  // ===== INJEÇÃO DE DEPENDÊNCIA ===== //
  private readonly _equipamentRental = inject(EquipmentRentalService);
  private readonly _employeeService = inject(EmployeeService);

  // ===== FORMULÁRIO ===== //
  createForm = new FormGroup({
    idmov: new FormControl('', [Validators.required, Validators.minLength(5)]),
    data_inicial: new FormControl('', Validators.required)
  });

  // ===== ESTADOS ===== //
  employeeInfo: any = null;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isNotFound: boolean = false;
  isServerError: boolean = false;

  currentStep: number = 1;
  maxStep: number = 2;

  successIllustration: string = 'assets/images/success.png';
  notFoundIllustration: string = 'assets/images/notFound.png';
  serverErrorIllustration: string = 'assets/images/serverError.png';

  // ===== HOOK ===== //
  ngOnInit(): void {
    this._employeeService.getInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.employee;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do colaborador: ', err);
        this.isServerError = true;
      }
    });
  };

  // ===== SUBMISSÃO ===== //
  onSubmit(): void {
    this.isLoading = true;

    const request = {
      criador: this.employeeInfo?.name,
      funcao: this.employeeInfo?.role,
      idmov: this.createForm.value.idmov,
      data_inicial: this.createForm.value.data_inicial
    };

    this._equipamentRental.send(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.isSuccess = true;
        },
        error: (err) => {
          if (err.status === 404) {
            this.isNotFound = true;
          } else {
            this.isServerError = true;
          }
          console.error('Erro ao enviar locação: ', err);
        }
      });
  };

  // ===== NAVEGAÇÃO ENTRE TELAS ===== //
  nextStep(): void {
    if (this.currentStep < this.maxStep) {
      this.currentStep++;
    };
  };

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    };
  };

  onTryAgain(): void {
    this.isNotFound = false;
    this.currentStep = 1;
  };
}
