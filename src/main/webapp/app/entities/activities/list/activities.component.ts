import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivities } from '../activities.model';
import { ActivitiesService } from '../service/activities.service';
import { ActivitiesDeleteDialogComponent } from '../delete/activities-delete-dialog.component';

@Component({
  selector: 'jhi-activities',
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent implements OnInit {
  activities?: IActivities[];
  isLoading = false;

  constructor(protected activitiesService: ActivitiesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.activitiesService.query().subscribe(
      (res: HttpResponse<IActivities[]>) => {
        this.isLoading = false;
        this.activities = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IActivities): number {
    return item.id!;
  }

  delete(activities: IActivities): void {
    const modalRef = this.modalService.open(ActivitiesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.activities = activities;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
