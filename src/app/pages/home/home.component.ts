import { Component, OnInit } from '@angular/core'
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';

import { LoginService } from '../../core/services/login.service';
import { UserService } from '../../core/services/user.service';

export interface DynamicField {
  icon: string;
  title: string;
  route?: string;
  externalLink?: string;
}

export interface DynamicSection {
  title: string;
  cards: DynamicField[];
}

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  userData: any = null;

  constructor(
    private readonly _userService: UserService,
    private readonly _loginService: LoginService,
    private readonly _router: Router
  ) { }

  sections: DynamicSection[] = [
    {
      title: '',
      cards: [
        {
          icon: 'campaign',
          title: 'Fala Aí - Sua denúncia 100% anônima!',
          externalLink: 'https://docs.google.com/forms/d/1h_UFcDfnbMmu710rZQ4pqF8_B-RnQUFs_7FsP_AREPc/edit'
        },
      ]
    },
    {
      title: 'Equipamentos',
      cards: [
        { icon: 'app_registration', title: 'Cadastrar', route: '/dashboard/equipament/register' },
        { icon: 'login', title: 'Checkin', route: '/dashboard/equipament/checkin' },
        { icon: 'logout', title: 'Checkout', route: '/dashboard/equipament/checkout' },
        { icon: 'menu', title: 'Lista', route: '/dashboard/equipament/list' },
      ]
    },
    {
      title: 'Operacional',
      cards: [
        { icon: 'gavel', title: 'Medida Disciplinar', route: '/dashboard/operational/disciplinary-measure' },
        { icon: 'assignment', title: 'Folha de Ponto', route: '' }
      ]
    },
    {
      title: 'Transporte',
      cards: [
        { icon: 'directions_bus', title: 'Solicitar', route: '/dashboard/transport/request' },
        { icon: 'no_transfer', title: 'Cancelar', route: '/dashboard/transport/cancel' }
      ]
    },
    {
      title: 'Mais Opções',
      cards: [
        { icon: 'settings', title: 'Configurações', route: '' },
        { icon: 'logout', title: 'Sair', route: '' }
      ]
    }
  ]

  ngOnInit(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  handleCardClick(card: DynamicField): void {
    if (card.externalLink) {
      window.open(card.externalLink, '_blank', 'noopener,noreferrer');
    } else if (card.route) {
      this._router.navigate([card.route]);
    }
  }

  onLogout(): void {
    this._loginService.logout();
  }

  getUser(string: string): string {
    return string.toLowerCase().split(' ')[0];
  }
}
