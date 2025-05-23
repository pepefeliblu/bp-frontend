import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '@bp-frontend/shared-models';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let store: MockStore;

  const initialState = {
    products: {
      entities: {},
      ids: [],
      loading: false,
      error: null
    }
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.jpg',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products when loaded', () => {
    store.setState({
      products: {
        entities: { '1': mockProducts[0] },
        ids: ['1'],
        loading: false,
        error: null
      }
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-list__grid')).toBeTruthy();
    expect(compiled.querySelector('bp-product-card')).toBeTruthy();
  });

  it('should show loading state', () => {
    store.setState({
      products: {
        ...initialState.products,
        loading: true
      }
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-list__loading')).toBeTruthy();
  });

  it('should show error state', () => {
    const errorMessage = 'Error loading products';
    store.setState({
      products: {
        ...initialState.products,
        error: errorMessage
      }
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-list__error')).toBeTruthy();
    expect(compiled.querySelector('.product-list__error').textContent).toContain(errorMessage);
  });
});

