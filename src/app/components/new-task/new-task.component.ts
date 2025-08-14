import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-task',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.scss'
})
export class NewTaskComponent {

  private readonly _route = inject(Router)

  onReturn(): void {
    this._route.navigate(['dashboard']);
  }
}
