import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../core/services/user.service';
import { CancelTransportService } from '../../core/services/cancel-transport.service';

@Component({
  selector: 'app-cancel-transport',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './cancel-transport.component.html',
  styleUrl: './cancel-transport.component.scss'
})
export class CancelTransportComponent implements OnInit {

  private readonly _cancelService = inject(CancelTransportService);
  private readonly _userService = inject(UserService);

  reasons: any = [
    'NÃO PRECISO',
    'VEÍCULO PRÓPRIO',
    'RECEBO CARONA',
    'TRABALHO REMOTO',
    'MUDANÇA DE ENDEREÇO',
    'TRANSPORTE ALTERNATIVO',
    'MORADIA PRÓXIMA AO TRABALHO',
    'LICENÇA OU AFASTAMENTO',
    'OUTRO MOTIVO'
  ];

  userData: any = null;

  currentStep = 1;
  totalSteps = 3;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  successIllustration: string = 'assets/images/task.png';
  serverErrorIllustration: string = 'assets/images/serverError.png';

  createForm = new FormGroup({
    motivo: new FormControl('', Validators.required),
    endereco: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

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

  onSubmit(): void {
    this.isLoading = true;

    const request = {
      chapa: this.userData.chapa,
      motivo: this.createForm.value.motivo,
      endereco: this.createForm.value.endereco
    };

    this._cancelService.create(request)
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
