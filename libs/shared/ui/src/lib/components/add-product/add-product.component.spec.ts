import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddProductComponent } from './add-product.component';
import { By } from '@angular/platform-browser';
import { ProductsService } from '@bp-frontend/products-domain';
import { of } from 'rxjs';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    const mockProductsService = {
      verifyProductId: () => of(false) // ID is available by default
    };
    
    await TestBed.configureTestingModule({
      imports: [AddProductComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all form fields and buttons', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input#id')).toBeTruthy();
    expect(compiled.querySelector('input#name')).toBeTruthy();
    expect(compiled.querySelector('input#description')).toBeTruthy();
    expect(compiled.querySelector('input#logo')).toBeTruthy();
    expect(compiled.querySelector('input#date_release')).toBeTruthy();
    expect(compiled.querySelector('input#date_revision')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    expect(compiled.querySelector('button.reset-btn')).toBeTruthy();
  });

  it('should validate required fields', () => {
    component.form.setValue({
      id: '', name: '', description: '', logo: '', date_release: '', date_revision: ''
    });
    fixture.detectChanges();
    expect(component.form.invalid).toBeTruthy();
    expect(component.form.get('id')?.hasError('required')).toBeTruthy();
    expect(component.form.get('name')?.hasError('required')).toBeTruthy();
    expect(component.form.get('description')?.hasError('required')).toBeTruthy();
    expect(component.form.get('logo')?.hasError('required')).toBeTruthy();
    expect(component.form.get('date_release')?.hasError('required')).toBeTruthy();
  });

  it('should disable ID field in edit mode', () => {
    component.product = {
      id: 'edit-id',
      name: 'Edit Name',
      description: 'Edit Description',
      logo: 'logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    };
    component.ngOnChanges({ product: { currentValue: component.product, previousValue: null, firstChange: true, isFirstChange: () => true } });
    fixture.detectChanges();
    const idInput = fixture.debugElement.query(By.css('input#id'));
    expect(idInput.nativeElement.disabled).toBeTruthy();
    expect(component.isEditMode).toBeTruthy();
  });

  it('should enable ID field in add mode', () => {
    component.product = null;
    component.ngOnChanges({ product: { currentValue: null, previousValue: {}, firstChange: false, isFirstChange: () => false } });
    fixture.detectChanges();
    const idInput = fixture.debugElement.query(By.css('input#id'));
    expect(idInput.nativeElement.disabled).toBeFalsy();
    expect(component.isEditMode).toBeFalsy();
  });

  it('should emit submitProduct with correct value on submit (add mode)', fakeAsync(() => {
    const submitSpy = jest.spyOn(component.submitProduct, 'emit');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().slice(0, 10);
    const revisionDate = new Date(futureDate);
    revisionDate.setFullYear(revisionDate.getFullYear() + 1);
    const revisionDateStr = revisionDate.toISOString().slice(0, 10);
    
    component.form.setValue({
      id: 'newid',
      name: 'New Name',
      description: 'A valid description for product',
      logo: 'logo.png',
      date_release: futureDateStr,
      date_revision: revisionDateStr
    });
    
    tick(500); // Wait for async validation
    fixture.detectChanges();
    
    component.onSubmit();
    expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({
      id: 'newid',
      name: 'New Name',
      description: 'A valid description for product',
      logo: 'logo.png',
      date_release: futureDateStr,
      date_revision: revisionDateStr
    }));
  }));

  it('should emit submitProduct with correct value on submit (edit mode)', fakeAsync(() => {
    const submitSpy = jest.spyOn(component.submitProduct, 'emit');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().slice(0, 10);
    const revisionDate = new Date(futureDate);
    revisionDate.setFullYear(revisionDate.getFullYear() + 1);
    const revisionDateStr = revisionDate.toISOString().slice(0, 10);
    
    component.product = {
      id: 'editid',
      name: 'Edit Name',
      description: 'Edit Description',
      logo: 'logo.png',
      date_release: futureDateStr,
      date_revision: revisionDateStr
    };
    component.ngOnChanges({ product: { currentValue: component.product, previousValue: null, firstChange: true, isFirstChange: () => true } });
    fixture.detectChanges();
    
    component.form.patchValue({
      name: 'Edit Name',
      description: 'Edit Description',
      logo: 'logo.png',
      date_release: futureDateStr,
      date_revision: revisionDateStr
    });
    
    tick(500); // Wait for async validation
    fixture.detectChanges();
    
    component.onSubmit();
    expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({
      id: 'editid',
      name: 'Edit Name',
      description: 'Edit Description',
      logo: 'logo.png',
      date_release: futureDateStr,
      date_revision: revisionDateStr
    }));
  }));

  it('should reset the form on reset', () => {
    component.form.setValue({
      id: 'resetid',
      name: 'Reset Name',
      description: 'Reset Description',
      logo: 'logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });
    component.onReset();
    expect(component.form.value.id).toBeNull();
    expect(component.form.value.name).toBeNull();
  });

  it('should auto-calculate date_revision when date_release changes', fakeAsync(() => {
    component.form.get('date_release')?.setValue('2024-01-01');
    tick();
    fixture.detectChanges();
    expect(component.form.get('date_revision')?.value).toBe('2025-01-01');
  }));
});
