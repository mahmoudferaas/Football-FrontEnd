import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, ToastrModule.forRoot()],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, ToastrModule],
})
export class SharedModule {}
