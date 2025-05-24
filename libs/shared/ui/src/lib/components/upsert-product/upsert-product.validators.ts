import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {ProductsService} from "@bp-frontend/products-domain";
import {of} from "rxjs";
import {debounceTime, first, map, switchMap} from "rxjs/operators";

export function dateTodayOrLater(control: AbstractControl): ValidationErrors | null {
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

export function idUniqueValidator(productsService: ProductsService): AsyncValidatorFn {
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
