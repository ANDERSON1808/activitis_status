import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ActivitiesService } from '../service/activities.service';

import { ActivitiesComponent } from './activities.component';

describe('Component Tests', () => {
  describe('Activities Management Component', () => {
    let comp: ActivitiesComponent;
    let fixture: ComponentFixture<ActivitiesComponent>;
    let service: ActivitiesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ActivitiesComponent],
      })
        .overrideTemplate(ActivitiesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivitiesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ActivitiesService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.activities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
