import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { CancelTransportService } from '../../../core/services/cancel-transport.service';

@Component({
  selector: 'app-request-transport',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './request-transport.component.html',
  styleUrl: './request-transport.component.scss'
})
export class RequestTransportComponent implements OnInit {

  private readonly _userService = inject(UserService);
  private readonly _cancelService = inject(CancelTransportService);

  options: any = [
    'ÔNIBUS',
    'METRÔ',
    'AMBOS'
  ];

  reasons: any = [
    'PRECISO DE VALE TRANSPORTE',
    'MUDANÇA DE ENDEREÇO',
    'SEM VEÍCULO PRÓPRIO',
    'SEM CARONA DISPONÍVEL',
    'SEM TRANSPORTE ALTERNATIVO',
    'MORADIA DISTANTE DO TRABALHO',
    'RETORNO DE LICENÇA',
    'OUTRO MOTIVO'
  ];

  currentStep = 1;
  totalSteps = 5;

  userData: any = null;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  successIllustration: string = 'assets/images/success.png';
  serverErrorIllustration: string = 'assets/images/error.png';

  createForm = new FormGroup({
    motivo: new FormControl('', Validators.required),
    endereco: new FormControl('', [Validators.required, Validators.minLength(10)]),
    transporte: new FormControl('', Validators.required),
    quantidade: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)])
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
      tipo: 'SOLICITAÇÃO',
      motivo: this.createForm.value.motivo,
      endereco: this.createForm.value.endereco,
      transporte: this.createForm.value.transporte,
      quantidade: this.createForm.value.quantidade
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
