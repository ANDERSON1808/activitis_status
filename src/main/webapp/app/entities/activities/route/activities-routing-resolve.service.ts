import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivities, Activities } from '../activities.model';
import { ActivitiesService } from '../service/activities.service';

@Injectable({ providedIn: 'root' })
export class ActivitiesRoutingResolveService implements Resolve<IActivities> {
  constructor(protected service: ActivitiesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActivities> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((activities: HttpResponse<Activities>) => {
          if (activities.body) {
            return of(activities.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Activities());
  }
}
