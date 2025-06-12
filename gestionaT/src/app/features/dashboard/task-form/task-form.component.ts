import { CommonModule } from '@angular/common';  // Importa CommonModule
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TaskFormComponent {
  @Input() users: string[] = [];
  @Output() save = new EventEmitter<{ title: string; description: string; assignee: string | null }>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  assignee: string | null = null;

  onSubmit() {
    if (this.title && this.description) {
      this.save.emit({
        title: this.title,
        description: this.description,
        assignee: this.assignee,
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
    this.assignee = null;
  }
}
