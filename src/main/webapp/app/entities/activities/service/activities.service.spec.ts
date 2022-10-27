import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { IActivities, Activities } from '../activities.model';

import { ActivitiesService } from './activities.service';

describe('Service Tests', () => {
  describe('Activities Service', () => {
    let service: ActivitiesService;
    let httpMock: HttpTestingController;
    let elemDefault: IActivities;
    let expectedResult: IActivities | IActivities[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ActivitiesService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        detalle: 'AAAAAAA',
        status: Status.FINISHED,
        terminationDate: currentDate,
        daysLate: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            terminationDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Activities', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            terminationDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            terminationDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Activities()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Activities', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            detalle: 'BBBBBB',
            status: 'BBBBBB',
            terminationDate: currentDate.format(DATE_TIME_FORMAT),
            daysLate: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            terminationDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Activities', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            detalle: 'BBBBBB',
            terminationDate: currentDate.format(DATE_TIME_FORMAT),
            daysLate: 1,
          },
          new Activities()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            terminationDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Activities', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            detalle: 'BBBBBB',
            status: 'BBBBBB',
            terminationDate: currentDate.format(DATE_TIME_FORMAT),
            daysLate: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            terminationDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Activities', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addActivitiesToCollectionIfMissing', () => {
        it('should add a Activities to an empty array', () => {
          const activities: IActivities = { id: 123 };
          expectedResult = service.addActivitiesToCollectionIfMissing([], activities);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(activities);
        });

        it('should not add a Activities to an array that contains it', () => {
          const activities: IActivities = { id: 123 };
          const activitiesCollection: IActivities[] = [
            {
              ...activities,
            },
            { id: 456 },
          ];
          expectedResult = service.addActivitiesToCollectionIfMissing(activitiesCollection, activities);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Activities to an array that doesn't contain it", () => {
          const activities: IActivities = { id: 123 };
          const activitiesCollection: IActivities[] = [{ id: 456 }];
          expectedResult = service.addActivitiesToCollectionIfMissing(activitiesCollection, activities);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(activities);
        });

        it('should add only unique Activities to an array', () => {
          const activitiesArray: IActivities[] = [{ id: 123 }, { id: 456 }, { id: 88339 }];
          const activitiesCollection: IActivities[] = [{ id: 123 }];
          expectedResult = service.addActivitiesToCollectionIfMissing(activitiesCollection, ...activitiesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const activities: IActivities = { id: 123 };
          const activities2: IActivities = { id: 456 };
          expectedResult = service.addActivitiesToCollectionIfMissing([], activities, activities2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(activities);
          expect(expectedResult).toContain(activities2);
        });

        it('should accept null and undefined values', () => {
          const activities: IActivities = { id: 123 };
          expectedResult = service.addActivitiesToCollectionIfMissing([], null, activities, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(activities);
        });

        it('should return initial array if no Activities is added', () => {
          const activitiesCollection: IActivities[] = [{ id: 123 }];
          expectedResult = service.addActivitiesToCollectionIfMissing(activitiesCollection, undefined, null);
          expect(expectedResult).toEqual(activitiesCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
