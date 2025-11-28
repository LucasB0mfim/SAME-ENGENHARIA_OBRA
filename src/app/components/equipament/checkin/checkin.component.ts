import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';

import jsQR from 'jsqr';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-checkin',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent implements OnInit {

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;

  latitude: string = '';
  longitude: string = '';
  locationLoaded: boolean = false;

  userData: any = null;
  equipmentId: string = '';

  currentStep = 0;
  totalSteps = 2;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isServerError: boolean = false;
  isScanning: boolean = false;
  scanError: string = '';

  private stream: MediaStream | null = null;
  private animationFrame: number | null = null;

  successIllustration: string = 'assets/images/success.png';
  serverErrorIllustration: string = 'assets/images/error.png';

  private readonly _equipmentService = inject(EquipmentService);
  private readonly _userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(3)]],
      numero: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLocation();
  }

  async startScanning(): Promise<void> {
    this.isScanning = true;
    this.scanError = '';

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.videoElement.nativeElement.play();
        this.scanQRCode();
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      this.scanError = 'Não foi possível acessar a câmera. Verifique as permissões.';
      this.isScanning = false;
    }
  }

  scanQRCode(): void {
    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          this.onQRCodeDetected(code.data);
          return;
        }
      }

      this.animationFrame = requestAnimationFrame(scan);
    };

    scan();
  }

  onQRCodeDetected(data: string): void {
    this.equipmentId = data;
    this.form.patchValue({ equipmentId: data });
    this.stopScanning();
    this.nextStep();
  }

  stopScanning(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isScanning = false;
  }

  onSubmit(): void {
    // ← Validar se localização foi obtida
    if (!this.locationLoaded || !this.latitude || !this.longitude) {
      alert('Aguarde enquanto obtemos sua localização...');
      return;
    }

    this.isLoading = true; // ← Ativar loading

    const request = {
      id: this.equipmentId,
      cep: this.form.value.cep,
      numero: this.form.value.numero,
      latitude: this.latitude,
      longitude: this.longitude
    };

    console.log('📤 Enviando:', request); // ← Debug

    this._equipmentService.checkin(request)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          console.log('✅ Sucesso:', res);
          this.isSuccess = true; // ← Mostrar tela de sucesso
        },
        error: (err) => {
          console.error('❌ Erro:', err);
          this.isServerError = true; // ← Mostrar tela de erro
        }
      });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      if (this.currentStep === 1) {
        this.stopScanning();
      }
      this.currentStep--;
    }
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

  getLocation() {
    this._equipmentService.getLocationService().then(res => {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.locationLoaded = true; // ← Marcar como carregado
      console.log('📍 Localização obtida:', { lat: this.latitude, lng: this.longitude });
    }).catch(err => {
      console.error('Erro ao obter localização:', err);
      alert(`Não foi possível obter sua localização. Detalhes: ${err.message}`);
      this.locationLoaded = false;
    });
  }



}
