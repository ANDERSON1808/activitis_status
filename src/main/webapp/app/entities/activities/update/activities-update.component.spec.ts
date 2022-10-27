jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ActivitiesService } from '../service/activities.service';
import { IActivities, Activities } from '../activities.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { ActivitiesUpdateComponent } from './activities-update.component';

describe('Component Tests', () => {
  describe('Activities Management Update Component', () => {
    let comp: ActivitiesUpdateComponent;
    let fixture: ComponentFixture<ActivitiesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let activitiesService: ActivitiesService;
    let employeeService: EmployeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ActivitiesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ActivitiesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivitiesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      activitiesService = TestBed.inject(ActivitiesService);
      employeeService = TestBed.inject(EmployeeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employee query and add missing value', () => {
        const activities: IActivities = { id: 456 };
        const employee: IEmployee = { id: 84542 };
        activities.employee = employee;

        const employeeCollection: IEmployee[] = [{ id: 43776 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployees = [employee];
        const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ activities });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const activities: IActivities = { id: 456 };
        const employee: IEmployee = { id: 57076 };
        activities.employee = employee;

        activatedRoute.data = of({ activities });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(activities));
        expect(comp.employeesSharedCollection).toContain(employee);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Activities>>();
        const activities = { id: 123 };
        jest.spyOn(activitiesService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ activities });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: activities }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(activitiesService.update).toHaveBeenCalledWith(activities);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Activities>>();
        const activities = new Activities();
        jest.spyOn(activitiesService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ activities });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: activities }));
        saveSubject.complete();

        // THEN
        expect(activitiesService.create).toHaveBeenCalledWith(activities);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Activities>>();
        const activities = { id: 123 };
        jest.spyOn(activitiesService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ activities });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(activitiesService.update).toHaveBeenCalledWith(activities);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeeById', () => {
        it('Should return tracked Employee primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
