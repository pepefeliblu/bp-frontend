import {Component, EventEmitter, Output, OnInit, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn} from "@angular/forms";
import { ProductsService } from '@bp-frontend/products-domain';
import { debounceTime, map, switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

function dateTodayOrLater(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const inputDate = new Date(control.value + 'T00:00:00');
  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (inputDate < today) {
    return { notTodayOrLater: true };
  }
  return null;
}

function idUniqueValidator(productsService: ProductsService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(400),
      switchMap(id => productsService.verifyProductId(id)),
      map(isTaken => (isTaken ? { idTaken: true } : null)),
      first()
    );
  };
}

@Component({
  selector: 'lib-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  standalone: true
})
export class AddProductComponent implements OnInit, OnChanges {

  @Input() product: any = null;
  @Output() closeEmitter = new EventEmitter<void>();
  @Output() submitProduct = new EventEmitter<any>();

  form: FormGroup;
  isEditMode = false;
  private readonly productsService = inject(ProductsService);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [idUniqueValidator(this.productsService)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, dateTodayOrLater]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.form.get('date_release')?.valueChanges.subscribe((release: string) => {
      if (release) {
        const releaseDate = new Date(release);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        const iso = revisionDate.toISOString().slice(0, 10);
        this.form.get('date_revision')?.setValue(iso, { emitEvent: false });
      } else {
        this.form.get('date_revision')?.setValue('', { emitEvent: false });
      }
    });
  }

  private toDateInputValue(date: string | Date | null | undefined): string {
    if (!date) return '';
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.isEditMode = true;
      this.form.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        logo: this.product.logo,
        date_release: this.toDateInputValue(this.product.date_release),
        date_revision: this.toDateInputValue(this.product.date_revision),
      });
      this.form.get('id')?.disable();
      this.form.get('date_release')?.markAsTouched();
      this.form.get('date_release')?.updateValueAndValidity();
      this.form.get('date_revision')?.updateValueAndValidity();
    } else if (changes['product'] && !this.product) {
      this.isEditMode = false;
      this.form.reset();
      this.form.get('id')?.enable();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      if (this.isEditMode) {
        formValue.id = this.product.id; // ensure id is present
      }
      this.submitProduct.emit(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClose() {
    this.closeEmitter.emit();
  }

  onReset() {
    this.form.reset();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
