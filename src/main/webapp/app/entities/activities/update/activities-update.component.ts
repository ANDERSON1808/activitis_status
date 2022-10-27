import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IActivities, Activities } from '../activities.model';
import { ActivitiesService } from '../service/activities.service';

@Component({
  selector: 'jhi-activities-update',
  templateUrl: './activities-update.component.html',
})
export class ActivitiesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    detalle: [],
    status: [],
    terminationDate: [],
    daysLate: [],
  });

  constructor(protected activitiesService: ActivitiesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activities }) => {
      if (activities.id === undefined) {
        const today = dayjs().startOf('day');
        activities.terminationDate = today;
      }

      this.updateForm(activities);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activities = this.createFromForm();
    if (activities.id !== undefined) {
      this.subscribeToSaveResponse(this.activitiesService.update(activities));
    } else {
      this.subscribeToSaveResponse(this.activitiesService.create(activities));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivities>>): void {
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

  protected updateForm(activities: IActivities): void {
    this.editForm.patchValue({
      id: activities.id,
      name: activities.name,
      detalle: activities.detalle,
      status: activities.status,
      terminationDate: activities.terminationDate ? activities.terminationDate.format(DATE_TIME_FORMAT) : null,
      daysLate: activities.daysLate,
    });
  }

  protected createFromForm(): IActivities {
    return {
      ...new Activities(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      detalle: this.editForm.get(['detalle'])!.value,
      status: this.editForm.get(['status'])!.value,
      terminationDate: this.editForm.get(['terminationDate'])!.value
        ? dayjs(this.editForm.get(['terminationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      daysLate: this.editForm.get(['daysLate'])!.value,
    };
  }
}
