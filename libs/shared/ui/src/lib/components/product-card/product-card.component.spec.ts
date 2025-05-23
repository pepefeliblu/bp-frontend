import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '@bp-frontend/shared-models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'This is a test product',
    logo: 'test-logo.jpg',
    date_release: '2023-01-15',
    date_revision: '2024-01-15'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-card__title').textContent).toContain(mockProduct.name);
  });

  it('should display the product release date in DD/MM/YYYY format', () => {
    const compiled = fixture.nativeElement;
    const releaseDateElement = compiled.querySelector('.date-release>.product-card__date-value');
    expect(releaseDateElement).toBeTruthy();
    // Expect formatted date: DD/MM/YYYY
    expect(releaseDateElement.textContent).toContain('15/01/2023');
  });

  it('should display the product revision date in DD/MM/YYYY format', () => {
    const compiled = fixture.nativeElement;
    const revisionDateElement = compiled.querySelector('.date-revision>.product-card__date-value');
    expect(revisionDateElement).toBeTruthy();
    // Expect formatted date: DD/MM/YYYY
    expect(revisionDateElement.textContent).toContain('15/01/2024');
  });

  it('should display the product description', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-card__description').textContent).toContain(mockProduct.description);
  });

  it('should have the correct logo src and alt attributes', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('.product-card__logo');
    expect(imgElement).toBeTruthy();
    expect(imgElement.getAttribute('src')).toBe(mockProduct.logo);
    expect(imgElement.getAttribute('alt')).toBe(`${mockProduct.name} logo`);
  });

  it('should have the correct BEM class structure', () => {
    const compiled = fixture.nativeElement;
    const cardElement = compiled.querySelector('.product-card');
    expect(cardElement).toBeTruthy();

    // Check BEM element classes
    expect(compiled.querySelector('.product-card__title')).toBeTruthy();
    expect(compiled.querySelector('.product-card__description')).toBeTruthy();
    expect(compiled.querySelector('.product-card__logo')).toBeTruthy();
    expect(compiled.querySelector('.date-release')).toBeTruthy();
    expect(compiled.querySelector('.date-revision')).toBeTruthy();

    // Check for action buttons with BEM classes
    //expect(compiled.querySelector('.product-card__action--edit')).toBeTruthy();
    //expect(compiled.querySelector('.product-card__action--delete')).toBeTruthy();
  });
});

