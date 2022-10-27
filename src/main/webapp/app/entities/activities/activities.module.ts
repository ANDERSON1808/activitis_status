import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivitiesComponent } from './list/activities.component';
import { ActivitiesDetailComponent } from './detail/activities-detail.component';
import { ActivitiesUpdateComponent } from './update/activities-update.component';
import { ActivitiesDeleteDialogComponent } from './delete/activities-delete-dialog.component';
import { ActivitiesRoutingModule } from './route/activities-routing.module';

@NgModule({
  imports: [SharedModule, ActivitiesRoutingModule],
  declarations: [ActivitiesComponent, ActivitiesDetailComponent, ActivitiesUpdateComponent, ActivitiesDeleteDialogComponent],
  entryComponents: [ActivitiesDeleteDialogComponent],
})
export class ActivitiesModule {}
