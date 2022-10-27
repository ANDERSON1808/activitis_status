import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivitiesDetailComponent } from './activities-detail.component';

describe('Component Tests', () => {
  describe('Activities Management Detail Component', () => {
    let comp: ActivitiesDetailComponent;
    let fixture: ComponentFixture<ActivitiesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActivitiesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ activities: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ActivitiesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActivitiesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load activities on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.activities).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
