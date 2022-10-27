import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'activities',
        data: { pageTitle: 'activitiesStatusApp.activities.home.title' },
        loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'activitiesStatusApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
