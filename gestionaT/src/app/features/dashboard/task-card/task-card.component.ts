import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: { title: string; description: string; assignee: string | null };
  @Input() users: string[] = [];
  @Output() update = new EventEmitter<{ title: string; description: string; assignee: string | null }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  editedTask = { title: '', description: '', assignee: null as string | null };

  ngOnInit() {
    this.editedTask = { ...this.task };
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
