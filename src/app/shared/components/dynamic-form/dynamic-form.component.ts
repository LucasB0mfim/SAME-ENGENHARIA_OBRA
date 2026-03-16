import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  NgxMaskDirective,
  provideNgxMask
} from 'ngx-mask';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  FormArray
} from '@angular/forms';

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

export interface DynamicFormField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'qrcode' | 'geolocation' | 'select-list';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  accept?: string;
  mask?: string;
  min?: number;
  max?: number;
}

export interface DynamicFormSection {
  fields: DynamicFormField[];
}

export enum FormSubmissionState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface SelectListItem {
  nome: string;
  valor: number;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatIconModule,
    RouterLink
  ],
  providers: [provideNgxMask()],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() sections: DynamicFormSection[] = [];
  @Input() submitButtonText: string = 'Enviar';
  @Input() titleForm: string = '';
  @Input() submissionState?: FormSubmissionState = FormSubmissionState.IDLE;
  @Input() errorMessage: string = '';
  @Input() successMessage: string = 'Formulário enviado com sucesso!';
  @Input() asideTitle: string = '';
  @Input() asideContent: string = '';
  @Input() qrCode: string = '';

  @Output() formSubmit = new EventEmitter<FormData>();
  @Output() formStateChange = new EventEmitter<FormSubmissionState>();

  dynamicForm!: FormGroup;
  uploadedFiles: { [key: string]: File } = {};
  FormSubmissionState = FormSubmissionState;

  // QR Code scanner properties
  qrScannerActive: { [key: string]: boolean } = {};
  qrVideoElement: { [key: string]: HTMLVideoElement | null } = {};
  qrStream: { [key: string]: MediaStream | null } = {};

  // Geolocation properties
  geoLocationLoading: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const formConfig: any = {};

    this.sections.forEach(section => {
      section.fields.forEach(field => {
        const validators = [];

        if (field.required) {
          validators.push(Validators.required);
        }

        if (field.type === 'email') {
          validators.push(Validators.email);
        }

        if (field.type === 'number' && field.min !== undefined) {
          validators.push(Validators.min(field.min));
        }

        if (field.type === 'number' && field.max !== undefined) {
          validators.push(Validators.max(field.max));
        }

        if (field.type === 'select-list') {
          formConfig[field.name] = this.fb.array([
            this.createSelectListItem()
          ]);
        } else {
          formConfig[field.name] = ['', validators];
        }
      });
    });

    this.dynamicForm = this.fb.group(formConfig);
  }

  private createSelectListItem(): FormGroup {
    return this.fb.group({
      nome: [''],
      valor: []
    });
  }

  getFieldControl(fieldName: string): AbstractControl | null {
    return this.dynamicForm.get(fieldName);
  }

  getSelectListArray(fieldName: string): FormArray {
    return this.dynamicForm.get(fieldName) as FormArray;
  }

  addSelectListItem(fieldName: string): void {
    const formArray = this.getSelectListArray(fieldName);
    formArray.push(this.createSelectListItem());
  }

  removeSelectListItem(fieldName: string, index: number): void {
    const formArray = this.getSelectListArray(fieldName);
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.getFieldControl(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.getFieldControl(fieldName);

    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo é obrigatório';
    if (control.errors['email']) return 'E-mail inválido';
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.errors['max']) return `Valor máximo: ${control.errors['max'].max}`;

    return 'Campo inválido';
  }

  handleFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFiles[fieldName] = file;
      this.getFieldControl(fieldName)?.setValue(file.name);
      this.getFieldControl(fieldName)?.markAsTouched();
    }
  }

  removeFile(fieldName: string): void {
    delete this.uploadedFiles[fieldName];
    this.getFieldControl(fieldName)?.setValue('');

    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.markAsTouched();
    });

    if (this.dynamicForm.invalid) {
      return;
    }

    const formData = this.prepareFormData();
    this.formSubmit.emit(formData);
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    this.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = this.dynamicForm.get(field.name)?.value;

        if (value) {
          if (field.type === 'file' && this.uploadedFiles[field.name]) {
            formData.append(field.name, this.uploadedFiles[field.name]);
          } else if (field.type === 'select-list') {
            const filteredItems = value.filter((item: SelectListItem) => item.nome && item.nome.trim() !== '');
            if (filteredItems.length > 0) {
              formData.append(field.name, JSON.stringify(filteredItems));
            }
          } else if (field.type !== 'file') {
            formData.append(field.name, value.toString());
          }
        }
      });
    });

    return formData;
  }

  closeMessage(): void {
    this.formStateChange.emit(FormSubmissionState.IDLE);
  }

  // QR Code Scanner Methods
  async startQrScanner(fieldName: string): Promise<void> {
    this.qrScannerActive[fieldName] = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      this.qrStream[fieldName] = stream;

      setTimeout(() => {
        const video = document.getElementById(`qr-video-${fieldName}`) as HTMLVideoElement;
        if (video) {
          this.qrVideoElement[fieldName] = video;
          video.srcObject = stream;
          video.play();
          this.scanQrCode(fieldName);
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
      this.qrScannerActive[fieldName] = false;
    }
  }

  private scanQrCode(fieldName: string): void {
    const video = this.qrVideoElement[fieldName];
    if (!video || !this.qrScannerActive[fieldName]) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    const scan = () => {
      if (!this.qrScannerActive[fieldName]) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        import('jsqr').then(({ default: jsQR }) => {
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            this.getFieldControl(fieldName)?.setValue(code.data);
            this.getFieldControl(fieldName)?.markAsTouched();
            this.stopQrScanner(fieldName);
          } else {
            requestAnimationFrame(scan);
          }
        });
      } else {
        requestAnimationFrame(scan);
      }
    };

    scan();
  }

  stopQrScanner(fieldName: string): void {
    this.qrScannerActive[fieldName] = false;

    if (this.qrStream[fieldName]) {
      this.qrStream[fieldName]!.getTracks().forEach(track => track.stop());
      this.qrStream[fieldName] = null;
    }

    if (this.qrVideoElement[fieldName]) {
      this.qrVideoElement[fieldName] = null;
    }
  }

  ngOnDestroy(): void {
    Object.keys(this.qrStream).forEach(fieldName => {
      this.stopQrScanner(fieldName);
    });
  }

  // Geolocation Methods
  getGeolocation(fieldName: string): void {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    this.geoLocationLoading[fieldName] = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude}, ${longitude}`;

        this.getFieldControl(fieldName)?.setValue(locationString);
        this.getFieldControl(fieldName)?.markAsTouched();
        this.geoLocationLoading[fieldName] = false;
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        let errorMessage = 'Não foi possível obter sua localização.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Verifique as configurações do navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível no momento.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao tentar obter localização.';
            break;
        }

        alert(errorMessage);
        this.geoLocationLoading[fieldName] = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // QR Code Download and Share Methods
  downloadQRCode(): void {
    if (!this.qrCode) return;

    const fileName = this.getQRCodeFileName();
    const link = document.createElement('a');
    link.href = this.qrCode;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async shareQRCode(): Promise<void> {
    if (!this.qrCode) return;

    try {
      const response = await fetch(this.qrCode);
      const blob = await response.blob();
      const fileName = this.getQRCodeFileName();
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code do Equipamento',
          text: this.getShareText(),
          files: [file]
        });
      } else {
        alert('Compartilhamento não disponível neste dispositivo. Fazendo download do QR Code...');
        this.downloadQRCode();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
        alert('Não foi possível compartilhar. Tente fazer o download.');
      }
    }
  }

  private getQRCodeFileName(): string {
    const nomeField = this.sections
      .flatMap(s => s.fields)
      .find(f => f.name === 'nome');

    const nomeValue = nomeField ? this.dynamicForm.get('nome')?.value : null;
    return `qrcode-${nomeValue || 'equipamento'}.png`;
  }

  private getShareText(): string {
    const nomeField = this.sections
      .flatMap(s => s.fields)
      .find(f => f.name === 'nome');

    const nomeValue = nomeField ? this.dynamicForm.get('nome')?.value : 'equipamento';
    return `QR Code do equipamento: ${nomeValue}`;
  }
}
