import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextField } from './text-field';

describe('TextField', () => {
  let component: TextField;
  let fixture: ComponentFixture<TextField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextField],
    }).compileComponents();

    fixture = TestBed.createComponent(TextField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test-field');
    fixture.componentRef.setInput('label', 'Test field');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stores number input values as numbers', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '12.5';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBe(12.5);
  });

  it('keeps an empty number input empty for required validation', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBeNaN();
  });

  it('keeps text input values as strings', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '123';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBe('123');
  });
});
