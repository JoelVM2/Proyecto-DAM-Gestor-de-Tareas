import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-column-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './column-form.component.html',
})
export class ColumnFormComponent {
  columnTitle: string = '';

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    const trimmedTitle = this.columnTitle.trim();
    if (trimmedTitle) {
      this.save.emit(trimmedTitle);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
