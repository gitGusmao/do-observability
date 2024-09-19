import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PocsService } from '../shared/service/poc.service';
import { DataFrame } from '../shared/interfaces/data-frame';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  loading: boolean = false;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  dataFrame: DataFrame[] = [];
  textQuery: string = '';

  readonly dialog = inject(MatDialog);

  @ViewChild('queryTextArea') meuTextarea!: ElementRef;

  constructor(private _pocService: PocsService) {}

  openDialog(data?: any, index?: number) {
    const dialogRef = this.dialog.open(DataFrameDialog, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (index !== undefined) {
          this.dataFrame[index] = result;
        } else {
          result.path = `ler${result.type}(${result.path})->${result.variable}`;
          this.dataFrame.push(result);
        }
      }
    });
  }

  removeDataFrame(index: number) {
    this.dataFrame.splice(index, 1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  query() {
    this.loading = true;

    const textarea = this.meuTextarea.nativeElement;
    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const selectedText = textarea.value.substring(inicio, fim) || undefined;

    let dataFramePath: string = '';
    this.dataFrame.forEach((df) => {
      dataFramePath += `${df.path}\n`;
    });

    const fullQuery = selectedText ? selectedText : this.textQuery;
    const body =
      dataFramePath != '' ? `${dataFramePath}\n${fullQuery}` : fullQuery;

    this._pocService.query(body).subscribe(
      (response: any) => {
        const data = response.body.data;

        this.displayedColumns = Object.keys(data[0]);
        this.dataSource.data = data;

        this.loading = false;
      },
      (err: any) => {
        console.log('Error', err);
      }
    );
  }
}

@Component({
  selector: 'data-frame-dialog',
  template: `<h2 mat-dialog-title>New Data Frame</h2>
    <mat-dialog-content>
      <form [formGroup]="dataFrameForm" class="d-flex flex-column pt-25">
        <mat-form-field>
          <mat-label>Type file</mat-label>
          <mat-select formControlName="type">
            <mat-option value="Mysql">Mysql</mat-option>
            <mat-option value="Parquet">Parquet</mat-option>
            <mat-option value="Csv">Csv</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Path</mat-label>
          <input matInput formControlName="path" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Variable</mat-label>
          <input matInput formControlName="variable" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-flat-button (click)="closeDataFrame()">Cancel</button>
      <button
        mat-flat-button
        (click)="addDataFrame()"
        [disabled]="dataFrameForm.invalid"
      >
        <mat-icon>add</mat-icon>Add
      </button>
    </mat-dialog-actions>`,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  styles: `
    .py-25 {
      padding: 25px 0;
    }
  `,
})
export class DataFrameDialog {
  dataFrameForm: FormGroup;

  readonly dialogRef = inject(MatDialogRef<DataFrameDialog>);
  data = inject(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder) {
    this.dataFrameForm = this.fb.group({
      type: ['', Validators.required],
      path: ['', Validators.required],
      variable: ['', Validators.required],
    });

    if (this.data) {
      this.dataFrameForm.patchValue(this.data);
    }
  }

  get f() {
    return this.dataFrameForm.controls;
  }

  closeDataFrame() {
    this.dialogRef.close(undefined);
  }
  addDataFrame() {
    this.dialogRef.close(this.dataFrameForm.value);
  }
}
