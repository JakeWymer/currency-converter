import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConverterComponent } from './converter.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConverterComponent ],
      imports: [ FormsModule, HttpClientTestingModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct value in to-input', () => {
    let event = {
      target: {
        value: '1'
      }
    };

    component.fromInput = '1';
    component.conversionRate = 10;
    component.convertCurrency(event, 'from');

    expect(component.toInput).toEqual('10');
  });

  it('should display correct value in from-input', () => {
    let event = {
      target: {
        value: '1'
      }
    };

    component.toInput = '10';
    component.conversionRate = 5;
    component.convertCurrency(event, 'to');

    expect(component.fromInput).toEqual('2');
  });

  it('should clear both inputs if event value length is 0', () => {
    let event = {
      target: {
        value: ''
      }
    };

    component.convertCurrency(event, 'to');

    expect(component.fromInput === '').toBeTruthy();
    expect(component.toInput === '').toBeTruthy();
  });
});