import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployee, Employee } from '../employee.model';

import { EmployeeService } from './employee.service';

describe('Service Tests', () => {
  describe('Employee Service', () => {
    let service: EmployeeService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployee;
    let expectedResult: IEmployee | IEmployee[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmployeeService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        created: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            created: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            created: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
          },
          returnedFromService
        );

        service.create(new Employee()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            created: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Employee', () => {
        const patchObject = Object.assign(
          {
            created: currentDate.format(DATE_TIME_FORMAT),
          },
          new Employee()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            created: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            created: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Employee', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmployeeToCollectionIfMissing', () => {
        it('should add a Employee to an empty array', () => {
          const employee: IEmployee = { id: 123 };
          expectedResult = service.addEmployeeToCollectionIfMissing([], employee);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });

        it('should not add a Employee to an array that contains it', () => {
          const employee: IEmployee = { id: 123 };
          const employeeCollection: IEmployee[] = [
            {
              ...employee,
            },
            { id: 456 },
          ];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Employee to an array that doesn't contain it", () => {
          const employee: IEmployee = { id: 123 };
          const employeeCollection: IEmployee[] = [{ id: 456 }];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
        });

        it('should add only unique Employee to an array', () => {
          const employeeArray: IEmployee[] = [{ id: 123 }, { id: 456 }, { id: 94737 }];
          const employeeCollection: IEmployee[] = [{ id: 123 }];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, ...employeeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const employee: IEmployee = { id: 123 };
          const employee2: IEmployee = { id: 456 };
          expectedResult = service.addEmployeeToCollectionIfMissing([], employee, employee2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
          expect(expectedResult).toContain(employee2);
        });

        it('should accept null and undefined values', () => {
          const employee: IEmployee = { id: 123 };
          expectedResult = service.addEmployeeToCollectionIfMissing([], null, employee, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });

        it('should return initial array if no Employee is added', () => {
          const employeeCollection: IEmployee[] = [{ id: 123 }];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, undefined, null);
          expect(expectedResult).toEqual(employeeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
