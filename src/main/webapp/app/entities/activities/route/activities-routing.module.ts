import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivitiesComponent } from '../list/activities.component';
import { ActivitiesDetailComponent } from '../detail/activities-detail.component';
import { ActivitiesUpdateComponent } from '../update/activities-update.component';
import { ActivitiesRoutingResolveService } from './activities-routing-resolve.service';

const activitiesRoute: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivitiesDetailComponent,
    resolve: {
      activities: ActivitiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivitiesUpdateComponent,
    resolve: {
      activities: ActivitiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivitiesUpdateComponent,
    resolve: {
      activities: ActivitiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activitiesRoute)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
