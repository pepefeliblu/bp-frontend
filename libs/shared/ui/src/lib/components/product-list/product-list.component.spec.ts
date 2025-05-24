import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductListComponent } from './product-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '@bp-frontend/shared-models';
import { By } from '@angular/platform-browser';
import { ProductsService } from '@bp-frontend/products-domain';
import { of } from 'rxjs';

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
    const mockProductsService = {
      verifyProductId: () => of(false)
    };
    
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: ProductsService, useValue: mockProductsService }
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
    expect(compiled.querySelector('.product-list__table-container')).toBeTruthy();
    expect(compiled.querySelector('.product-list__table')).toBeTruthy();
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

  it('should open add product modal', () => {
    component.openAddProductModal();
    fixture.detectChanges();
    expect(component.showAddProductModal).toBeTruthy();
    const modal = fixture.nativeElement.querySelector('lib-add-product');
    expect(modal).toBeTruthy();
  });

  it('should open edit product modal with correct product', () => {
    component.openEditProductModal(mockProducts[0]);
    fixture.detectChanges();
    expect(component.showAddProductModal).toBeTruthy();
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should open delete modal with correct product', () => {
    component.openDeleteProductModal(mockProducts[0]);
    fixture.detectChanges();
    expect(component.productToDelete).toEqual(mockProducts[0]);
    const modal = fixture.nativeElement.querySelector('.delete-modal');
    expect(modal).toBeTruthy();
    expect(modal.textContent).toContain('Test Product');
  });

  it('should close delete modal on cancel', () => {
    component.openDeleteProductModal(mockProducts[0]);
    fixture.detectChanges();
    component.closeDeleteProductModal();
    fixture.detectChanges();
    expect(component.productToDelete).toBeNull();
    const modal = fixture.nativeElement.querySelector('.delete-modal');
    expect(modal).toBeFalsy();
  });

  it('should dispatch deleteProduct on confirmDeleteProduct', () => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    component.openDeleteProductModal(mockProducts[0]);
    fixture.detectChanges();
    component.confirmDeleteProduct();
    expect(storeSpy).toHaveBeenCalled();
  });

  it('should open context menu and select options', () => {
    component.contextMenuOpenId = null;
    fixture.detectChanges();
    // Simulate opening context menu for product
    component.contextMenuOpenId = mockProducts[0].id;
    fixture.detectChanges();
    expect(component.contextMenuOpenId).toBe(mockProducts[0].id);
    // Simulate clicking Editar
    const editSpy = jest.spyOn(component, 'openEditProductModal');
    component.openEditProductModal(mockProducts[0]);
    expect(editSpy).toHaveBeenCalledWith(mockProducts[0]);
    // Simulate clicking Eliminar
    const deleteSpy = jest.spyOn(component, 'openDeleteProductModal');
    component.openDeleteProductModal(mockProducts[0]);
    expect(deleteSpy).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should close delete modal on backdrop click', () => {
    component.openDeleteProductModal(mockProducts[0]);
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('.delete-modal-backdrop'));
    backdrop.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.productToDelete).toBeNull();
  });
});

