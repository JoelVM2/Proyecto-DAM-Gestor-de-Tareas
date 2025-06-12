import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent {
  @Input() column!: { title: string; tasks: any[] };
  @Input() users: string[] = [];
  @Input() connectedTo: string[] = [];

  @Output() addTaskClick = new EventEmitter<void>();
  @Output() taskSelected = new EventEmitter<any>();
  @Output() taskDropped = new EventEmitter<{ event: CdkDragDrop<any[]>; column: any }>();

  // Devuelve un id único para esta columna, basado en el título
  get columnId(): string {
    return 'cdk-list-' + this.column.title.split(' ').join('-');
  }

  addTask() {
    this.addTaskClick.emit();
  }

  selectTask(task: any) {
    this.taskSelected.emit(task);
  }

  drop(event: CdkDragDrop<any[]>) {
    this.taskDropped.emit({ event, column: this.column });
  }
}
