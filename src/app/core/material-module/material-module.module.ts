import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatAutocompleteModule,
  MatChipsModule, MatSelectModule
} from '@angular/material';

import {DragDropModule} from "@angular/cdk/drag-drop"
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
//import {A11yModule} from '@angular/cdk/a11y';

@NgModule({
  imports: [
  CommonModule,
  CdkTableModule,
  DragDropModule,
  CdkStepperModule,
  CdkTreeModule,
  PortalModule,
  ScrollingModule,
  //AllyModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatSelectModule,
  MatProgressSpinnerModule
  ],
  exports: [
  CommonModule,
  PortalModule,
  ScrollingModule,
  //AllyModule,
  MatAutocompleteModule,
  CdkTableModule,
  DragDropModule,
  CdkStepperModule,
  CdkTreeModule,
    MatChipsModule,
   MatToolbarModule,
   MatButtonModule,
   MatCardModule,
   MatInputModule,
   MatDialogModule,
   MatTableModule,
   MatMenuModule,
   MatIconModule,
   MatSelectModule,
   MatProgressSpinnerModule
   ],
})
export class CustomMaterialModule { }
