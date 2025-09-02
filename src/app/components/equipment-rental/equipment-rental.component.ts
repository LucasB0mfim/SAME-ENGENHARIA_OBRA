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
    numero_documento: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  // ===== ESTADOS ===== //
  employeeInfo: any = null;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isNotFound: boolean = false;
  isServerError: boolean = false;

  currentStep: number = 1;
  maxStep: number = 3;

  uploadedFile: File | null = null;
  compressedFile: File | null = null;

  successIllustration: string = 'assets/images/success.png';
  notFoundIllustration: string = 'assets/images/notFound.png';
  serverErrorIllustration: string = 'assets/images/serverError.png';

  // ===== CONFIGURAÇÕES FIXAS DE COMPRESSÃO ===== //
  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 600;
  private readonly QUALITY = 0.3; // 30% de qualidade - baixa mas legível

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

    if (!this.compressedFile && !this.uploadedFile) {
      alert('O envio da foto é obrigatório!');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('criador', this.employeeInfo.name);
    formData.append('idmov', this.createForm.value.idmov || '');
    formData.append('numero_documento', this.createForm.value.numero_documento || '');

    // Usa a imagem comprimida se disponível, senão usa a original
    const fileToSend = this.compressedFile || this.uploadedFile!;
    formData.append('foto_equipamento', fileToSend, fileToSend.name);

    this._equipamentRental.send(formData)
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

  // ===== CAPTURAR E COMPRIMIR IMAGEM ===== //
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];

      // Comprimir a imagem automaticamente
      this.compressImage(this.uploadedFile)
        .then(compressedFile => {
          this.compressedFile = compressedFile;
          console.log(`Imagem comprimida: ${(this.uploadedFile!.size / 1024).toFixed(0)}KB -> ${(compressedFile.size / 1024).toFixed(0)}KB`);
        })
        .catch(error => {
          console.error('Erro ao comprimir imagem:', error);
          // Em caso de erro na compressão, usa a imagem original
          this.compressedFile = null;
        });
    }
  }

  // ===== FUNÇÃO SIMPLES DE COMPRESSÃO DE IMAGEM ===== //
  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcula as novas dimensões mantendo a proporção
        let { width, height } = this.calculateNewDimensions(img.width, img.height);

        // Define o tamanho do canvas
        canvas.width = width;
        canvas.height = height;

        // Desenha a imagem redimensionada no canvas
        ctx!.drawImage(img, 0, 0, width, height);

        // Converte para JPEG com qualidade baixa
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_compressed.jpg'),
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Erro ao comprimir imagem'));
            }
          },
          'image/jpeg',
          this.QUALITY
        );
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // ===== CALCULAR NOVAS DIMENSÕES ===== //
  private calculateNewDimensions(originalWidth: number, originalHeight: number): { width: number, height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Redimensiona se exceder os limites máximos
    if (width > this.MAX_WIDTH) {
      height = (height * this.MAX_WIDTH) / width;
      width = this.MAX_WIDTH;
    }

    if (height > this.MAX_HEIGHT) {
      width = (width * this.MAX_HEIGHT) / height;
      height = this.MAX_HEIGHT;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }
}

