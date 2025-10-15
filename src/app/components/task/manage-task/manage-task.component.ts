import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-manage-task',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-task.component.html',
  styleUrl: './manage-task.component.scss'
})
export class ManageTaskComponent implements OnInit {
  private readonly _taskService = inject(TaskService);
  private readonly _userService = inject(UserService);

  userData: any = [];
  taskData: any = [];
  taskLength: number = 0;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.employee;
        this.findTaskByUser(this.userData.email);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  findTaskByUser(user: string): void {
    this.isLoading = true;

    this._taskService.findTaskByUser(user)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res) => {
        this.taskData = res.result;
        this.taskLength = this.taskData.length
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  formateDate(date: string): string {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
}
