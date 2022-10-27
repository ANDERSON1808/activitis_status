import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivities } from '../activities.model';
import { ActivitiesService } from '../service/activities.service';

@Component({
  templateUrl: './activities-delete-dialog.component.html',
})
export class ActivitiesDeleteDialogComponent {
  activities?: IActivities;

  constructor(protected activitiesService: ActivitiesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activitiesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
