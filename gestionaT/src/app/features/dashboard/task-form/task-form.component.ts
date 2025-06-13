import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  @Input() users: User[] = [];
  @Output() save = new EventEmitter<{ title: string; description: string; assignedTo: number | null }>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  assignedTo: number | null = null;

  onSubmit() {
    if (this.title && this.description) {
      this.save.emit({
        title: this.title,
        description: this.description,
        assignedTo: this.assignedTo,
      });
      this.resetForm();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.assignedTo = null;
  }
}
