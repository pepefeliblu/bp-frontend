import {Component, EventEmitter, Output, OnInit, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { ProductsService } from '@bp-frontend/products-domain';
import {dateTodayOrLater, idUniqueValidator} from "./upsert-product.validators";

@Component({
  selector: 'lib-upsert-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-product.component.html',
  styleUrl: './upsert-product.component.scss',
  standalone: true
})
export class UpsertProductComponent implements OnInit, OnChanges {

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
