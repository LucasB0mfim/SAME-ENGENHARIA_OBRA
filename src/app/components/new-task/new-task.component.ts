import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-task',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {

  private readonly _route = inject(Router);

  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepFive: boolean = false;

  onHome(): void {
    this._route.navigate(['dashboard']);
  }

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

  formatCurrency(event: any) {
    let value = event.target.value;

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, "");

    // Converte para número e divide por 100
    const numericValue = parseFloat(value) / 100;

    // Formata como BRL
    event.target.value = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

}
