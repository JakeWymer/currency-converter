import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ConverterComponent} from './converter/converter.component';
import {GraphComponent} from './graph/graph.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ConverterComponent,
        GraphComponent
      ],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
