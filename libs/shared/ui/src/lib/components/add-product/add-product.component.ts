import {Component, EventEmitter, Output, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn} from "@angular/forms";
import { ProductsService } from '@bp-frontend/products-domain';
import { debounceTime, map, switchMap, first } from 'rxjs/operators';
import { of } from 'rxjs';

function dateTodayOrLater(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0,0,0,0);
  const inputDate = new Date(control.value);
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
export class AddProductComponent implements OnInit {

  @Output() closeEmitter = new EventEmitter<void>();
  @Output() submitProduct = new EventEmitter<any>();

  form: FormGroup;
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

  onSubmit() {
    debugger
    if (this.form.valid) {
      this.submitProduct.emit(this.form.getRawValue());
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
