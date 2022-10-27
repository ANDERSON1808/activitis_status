import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivities, getActivitiesIdentifier } from '../activities.model';

export type EntityResponseType = HttpResponse<IActivities>;
export type EntityArrayResponseType = HttpResponse<IActivities[]>;

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(activities: IActivities): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activities);
    return this.http
      .post<IActivities>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(activities: IActivities): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activities);
    return this.http
      .put<IActivities>(`${this.resourceUrl}/${getActivitiesIdentifier(activities) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(activities: IActivities): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(activities);
    return this.http
      .patch<IActivities>(`${this.resourceUrl}/${getActivitiesIdentifier(activities) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IActivities>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActivities[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addActivitiesToCollectionIfMissing(
    activitiesCollection: IActivities[],
    ...activitiesToCheck: (IActivities | null | undefined)[]
  ): IActivities[] {
    const activities: IActivities[] = activitiesToCheck.filter(isPresent);
    if (activities.length > 0) {
      const activitiesCollectionIdentifiers = activitiesCollection.map(activitiesItem => getActivitiesIdentifier(activitiesItem)!);
      const activitiesToAdd = activities.filter(activitiesItem => {
        const activitiesIdentifier = getActivitiesIdentifier(activitiesItem);
        if (activitiesIdentifier == null || activitiesCollectionIdentifiers.includes(activitiesIdentifier)) {
          return false;
        }
        activitiesCollectionIdentifiers.push(activitiesIdentifier);
        return true;
      });
      return [...activitiesToAdd, ...activitiesCollection];
    }
    return activitiesCollection;
  }

  protected convertDateFromClient(activities: IActivities): IActivities {
    return Object.assign({}, activities, {
      terminationDate: activities.terminationDate?.isValid() ? activities.terminationDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.terminationDate = res.body.terminationDate ? dayjs(res.body.terminationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((activities: IActivities) => {
        activities.terminationDate = activities.terminationDate ? dayjs(activities.terminationDate) : undefined;
      });
    }
    return res;
  }
}
