import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../core/services/login.service';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _login = inject(LoginService);
  private readonly _employeeService = inject(EmployeeService);

  employeeInfo: any = null;

  avatar: string = 'assets/images/avatar.png';
  username: string = '';

  ngOnInit(): void {
    this._employeeService.getInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.employee;
        this.username = this.employeeInfo.username || 'Usuário';
        this.avatar = this.employeeInfo.avatar || 'assets/images/avatar.png';
      },
      error: (err) => {
        this.avatar = 'assets/images/avatar.png';
        console.error('Erro ao carregar dados do colaborador: ', err);
      }
    });
  };

  openForm(): void {
    window.open('https://docs.google.com/forms/d/1h_UFcDfnbMmu710rZQ4pqF8_B-RnQUFs_7FsP_AREPc/edit', "_blank", "noopener,noreferrer");
  };

  onLogout(): void {
    this._login.logout();
  }
}
