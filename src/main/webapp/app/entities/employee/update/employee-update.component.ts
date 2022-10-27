import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEmployee, Employee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { IActivities } from 'app/entities/activities/activities.model';
import { ActivitiesService } from 'app/entities/activities/service/activities.service';

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {
  isSaving = false;

  activitiesSharedCollection: IActivities[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    created: [],
    activities: [],
  });

  constructor(
    protected employeeService: EmployeeService,
    protected activitiesService: ActivitiesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      if (employee.id === undefined) {
        const today = dayjs().startOf('day');
        employee.created = today;
      }

      this.updateForm(employee);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employee = this.createFromForm();
    if (employee.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  trackActivitiesById(index: number, item: IActivities): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployee>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(employee: IEmployee): void {
    this.editForm.patchValue({
      id: employee.id,
      name: employee.name,
      created: employee.created ? employee.created.format(DATE_TIME_FORMAT) : null,
      activities: employee.activities,
    });

    this.activitiesSharedCollection = this.activitiesService.addActivitiesToCollectionIfMissing(
      this.activitiesSharedCollection,
      employee.activities
    );
  }

  protected loadRelationshipsOptions(): void {
    this.activitiesService
      .query()
      .pipe(map((res: HttpResponse<IActivities[]>) => res.body ?? []))
      .pipe(
        map((activities: IActivities[]) =>
          this.activitiesService.addActivitiesToCollectionIfMissing(activities, this.editForm.get('activities')!.value)
        )
      )
      .subscribe((activities: IActivities[]) => (this.activitiesSharedCollection = activities));
  }

  protected createFromForm(): IEmployee {
    return {
      ...new Employee(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      created: this.editForm.get(['created'])!.value ? dayjs(this.editForm.get(['created'])!.value, DATE_TIME_FORMAT) : undefined,
      activities: this.editForm.get(['activities'])!.value,
    };
  }
}
