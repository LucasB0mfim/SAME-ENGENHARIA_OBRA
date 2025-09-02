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

  avatar: string = '';
  username: string = '';
  avatarDefault: string = 'assets/images/avatar.png';

  ngOnInit(): void {
    this._employeeService.getInfo().subscribe({
      next: (res) => {
        this.employeeInfo = res.employee;
        this.username = this.employeeInfo.username || 'Usuário';
        this.avatar = this.employeeInfo.avatar || this.avatarDefault;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do colaborador: ', err);
      }
    });
  };

  onLogout(): void {
    this._login.logout();
  }
}
