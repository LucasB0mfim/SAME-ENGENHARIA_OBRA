import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private readonly _login = inject(LoginService);

  avatar: string = 'https://i.pinimg.com/736x/2d/84/bd/2d84bdf4abd6f05f6efa07a5008d0d98.jpg'

  onLogout(): void {
    this._login.logout();
  }
}
