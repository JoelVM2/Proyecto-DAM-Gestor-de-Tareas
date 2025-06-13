import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent {
  @Input() column: any = null;
  @Input() users: any[] = [];
  @Input() connectedTo: string[] = [];

  @Output() addTaskClick = new EventEmitter<void>();
  @Output() taskSelected = new EventEmitter<any>();
  @Output() taskDropped = new EventEmitter<{ event: CdkDragDrop<any[]>; column: any }>();
  
  @Output() columnUpdated = new EventEmitter<any>();
  @Output() columnDeleted = new EventEmitter<number>();

  isEditingTitle = false;
  editableTitle = '';
  showConfirm = false

  get columnId(): string {
    if (!this.column?.name) {
      console.warn('Column name is missing, using fallback ID');
      return 'cdk-list-unknown';
    }
    return `cdk-list-${this.column.name.toLowerCase().split(' ').join('-')}`;
  }

  addTask(): void {
    this.addTaskClick.emit();
  }

  selectTask(task: any): void {
    this.taskSelected.emit(task);
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (!this.column) {
      console.error('Cannot drop - column is not defined');
      return;
    }
    
    this.taskDropped.emit({ 
      event, 
      column: this.column 
    });
  }

  trackByTaskId(index: number, task: any): string {
    return task.id;
  }

  enableEditTitle(): void {
    this.isEditingTitle = true;
    this.editableTitle = this.column.name;
  }

  saveTitle(): void {
    if (!this.editableTitle.trim()) {
      this.editableTitle = this.column.name;
    } else if (this.editableTitle.trim() !== this.column.name) {
      this.column.name = this.editableTitle.trim();
      this.columnUpdated.emit(this.column);
    }
    this.isEditingTitle = false;
  }

  cancelEditTitle(): void {
    this.isEditingTitle = false;
  }

  triggerDeleteConfirm(): void {
    this.showConfirm = true;
  }
  
  confirmDelete(): void {
    this.showConfirm = false;
    this.columnDeleted.emit(this.column.id);
  }
  
  cancelDelete(): void {
    this.showConfirm = false;
  }

  getUserNameById(userId?: number | null): string {
    if (!userId) return 'Sin asignar';
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Sin asignar';
  }
}
