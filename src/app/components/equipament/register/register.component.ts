import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterEquipamentComponent implements OnInit {

  form: FormGroup;
  userData: any = null;

  currentStep: number = 1;
  totalSteps: number = 2;

  selectedFile: File | null = null;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;

  qrCode: string = '';
  serverErrorIllustration: string = 'assets/images/error.png';

  private readonly _equipamentService = inject(EquipmentService);
  private readonly _userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      foto: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      this.selectedFile = file;
      this.form.patchValue({ foto: file });
      this.form.get('foto')?.markAsTouched();
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.form.patchValue({ foto: null });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (err) => {
        console.error('Erro ao buscar informações do usuário:', err.error?.message || err);
      }
    });
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!this.selectedFile) {
      alert('Por favor, selecione uma foto');
      return;
    }

    this.isLoading = true;
    this.isServerError = false;

    const formData = new FormData();
    formData.append('nome', this.form.get('nome')?.value);
    formData.append('foto', this.selectedFile, this.selectedFile.name);

    this._equipamentService.create(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.isSuccess = true;
          this.qrCode = res.qrCode;
          this.selectedFile = null;
        },
        error: (err) => {
          this.isServerError = true;
          console.error('Erro ao cadastrar equipamento:', err);
        }
      });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  downloadQRCode(): void {
    if (!this.qrCode) return;

    // Criar um elemento de link temporário
    const link = document.createElement('a');
    link.href = this.qrCode;
    link.download = `qrcode-${this.form.get('nome')?.value || 'equipamento'}.png`;

    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async shareQRCode(): Promise<void> {
    if (!this.qrCode) return;

    try {
      // Converter base64 para blob
      const response = await fetch(this.qrCode);
      const blob = await response.blob();
      const file = new File([blob], `qrcode-${this.form.get('nome')?.value || 'equipamento'}.png`, {
        type: 'image/png'
      });

      // Verificar se a API de compartilhamento está disponível
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code do Equipamento',
          text: `QR Code do equipamento: ${this.form.get('nome')?.value}`,
          files: [file]
        });
      } else {
        // Fallback: copiar para área de transferência ou fazer download
        alert('Compartilhamento não disponível neste dispositivo. Fazendo download do QR Code...');
        this.downloadQRCode();
      }
    } catch (error) {
      // Se o usuário cancelar ou houver erro
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        alert('Não foi possível compartilhar. Tente fazer o download.');
      }
    }
  }
}
