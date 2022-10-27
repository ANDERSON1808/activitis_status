jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IActivities, Activities } from '../activities.model';
import { ActivitiesService } from '../service/activities.service';

import { ActivitiesRoutingResolveService } from './activities-routing-resolve.service';

describe('Service Tests', () => {
  describe('Activities routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ActivitiesRoutingResolveService;
    let service: ActivitiesService;
    let resultActivities: IActivities | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ActivitiesRoutingResolveService);
      service = TestBed.inject(ActivitiesService);
      resultActivities = undefined;
    });

    describe('resolve', () => {
      it('should return IActivities returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActivities = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultActivities).toEqual({ id: 123 });
      });

      it('should return new IActivities if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActivities = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultActivities).toEqual(new Activities());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Activities })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActivities = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultActivities).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
