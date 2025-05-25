import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  standalone: true,
})
export class ColumnComponent {
  @Input() column!: { title: string; tasks: any[] };
  @Input() users: string[] = [];
}
