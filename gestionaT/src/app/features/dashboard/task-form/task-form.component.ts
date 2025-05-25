import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [FormsModule], // Incluye FormsModule aquí
})
export class TaskFormComponent {
  @Input() users: string[] = [];
  @Output() save = new EventEmitter<{ title: string; description: string; assignee: string | null }>();
  @Output() cancel = new EventEmitter<void>();

  isVisible = false;
  title = '';
  description = '';
  assignee: string | null = null;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  onSubmit() {
    const task = {
      title: this.title,
      description: this.description,
      assignee: this.assignee || '',
    };
    this.save.emit(task);
    this.close();
  }

  onSaveTask(task: { title: string; assignee: string | null }) {
    const assignee = task.assignee || 'Sin asignar'; // Maneja el caso en que sea null
    console.log(`Tarea guardada: ${task.title}, Asignada a: ${assignee}`);
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }
}