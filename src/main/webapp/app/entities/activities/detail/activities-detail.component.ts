import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivities } from '../activities.model';

@Component({
  selector: 'jhi-activities-detail',
  templateUrl: './activities-detail.component.html',
})
export class ActivitiesDetailComponent implements OnInit {
  activities: IActivities | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activities }) => {
      this.activities = activities;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
