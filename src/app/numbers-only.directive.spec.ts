import { NumbersOnlyDirective } from './numbers-only.directive';
import {ElementRef} from '@angular/core';

describe('NumbersOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new NumbersOnlyDirective(new ElementRef(null));
    expect(directive).toBeTruthy();
  });
});