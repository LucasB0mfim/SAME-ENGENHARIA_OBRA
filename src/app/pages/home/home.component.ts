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

  userData: any = {};
  userName: string = 'Carregando...'

  constructor(
    private readonly _userService: UserService,
    private readonly _loginService: LoginService,
    private readonly _router: Router
  ) { }

  get sections(): DynamicSection[] {
    return [
      {
        title: this.userName,
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
          { icon: 'task', title: 'Cadastrar tarefa', route: '/dashboard/operational/task/resgister' },
          { icon: 'assignment_add', title: 'Cadastrar tarefa', route: '/dashboard/operational/task/beta' },
          { icon: 'hourglass_top', title: 'Tarefas pendentes', route: '/dashboard/operational/task/pending' },
          { icon: 'storage', title: 'Histórico de tarefas', route: '/dashboard/operational/task/history' },
          { icon: 'groups', title: 'Colaboradores', route: '/dashboard/operational/employees' }
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
          { icon: 'logout', title: 'Sair', route: '/login' }
        ]
      }
    ];
  }

  ngOnInit(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
        this.getUser(this.userData.nome);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  handleCardClick(card: DynamicField): void {
    if (card.externalLink) {
      window.open(card.externalLink, '_blank', 'noopener,noreferrer');
    } else if (card.route === '/login') {
      this._loginService.logout();
    } else {
      this._router.navigate([card.route]);
    }
  }

  getUser(string: string): void {
    if (!string) {
      this.userName = 'Colaborador';
      return;
    }

    const words = string.trim().toLowerCase().split(' ');
    const firstName = words[0];
    const secondName = words[1] || '';

    const formatWord = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

    this.userName = secondName
      ? `${formatWord(firstName)} ${formatWord(secondName)}`
      : formatWord(firstName);
  }
}
