import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() users: User[] = [];
  @Output() update = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  editedTask!: Task;

  ngOnInit() {
    this.editedTask = { ...this.task };
    console.log('Usuarios recibidos en TaskCardComponent:', this.users);
  }

  onSave() {
    this.update.emit(this.editedTask);
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
