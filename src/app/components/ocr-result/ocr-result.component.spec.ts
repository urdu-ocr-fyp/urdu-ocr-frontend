import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrResultComponent } from './ocr-result.component';

describe('OcrResultComponent', () => {
  let component: OcrResultComponent;
  let fixture: ComponentFixture<OcrResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcrResultComponent]
    });
    fixture = TestBed.createComponent(OcrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
