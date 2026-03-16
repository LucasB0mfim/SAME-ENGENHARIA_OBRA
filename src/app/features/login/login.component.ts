import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // ========== INJEÇÃO DE DEPENDÊNCIAS ========== //
  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);

  // ========== FORMULÁRIOS ========== //
  cpfForm = new FormGroup({
    cpf: new FormControl('', [Validators.required, Validators.minLength(11)])
  });

  usernameForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required])
  });

  // ========== ESTADOS ========== //
  isLogin: boolean = false;
  loginMode: 'username' | 'cpf' = 'cpf';

  message: string = '';
  showMessage: boolean = false;
  messageType: 'success' | 'error' = 'success';

  // ========== MODO DE ACESSO ========== //
  toggleLoginMode(): void {
    this.loginMode = this.loginMode === 'cpf' ? 'username' : 'cpf';
    this.cpfForm.reset();
    this.usernameForm.reset();
  }

  // ========== API ========== //
  onSubmit(): void {
    this.isLogin = true;

    const serviceCall = this.loginMode === 'cpf'
      ? this._loginService.loginByCPF({ cpf: this.cpfForm.value.cpf })
      : this._loginService.loginByUsername({ username: this.usernameForm.value.username, password: this.usernameForm.value.password });

    serviceCall
      .pipe(finalize(() => this.isLogin = false))
      .subscribe({
        next: () => {
          this.setMessage('Logado com sucesso!', 'success');
          this._router.navigate(['dashboard/home']);
        },
        error: (err) => {
          this.setMessage(err.error.message, 'error');
          console.error('Erro ao solicitar acesso: ', err);
        }
      });
  }

  // ========== CAMPO INVÁLIDO ========== //
  isInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  // ========== MENSAGEM ========== //
  setMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.message = '';
    }, 3000);
  }
}
