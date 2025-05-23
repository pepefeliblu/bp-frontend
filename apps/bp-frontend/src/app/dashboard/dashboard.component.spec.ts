import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ProductListComponent } from '@bp-frontend/shared-ui';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';

// Standalone component, so we can use imports directly

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, ProductListComponent],
      providers: [provideMockStore({})] // Provide a mock store
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dashboard title', () => {
    const title = fixture.debugElement.query(By.css('.dashboard__title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toContain('Dashboard');
  });

  it('should render the bp-product-list component', () => {
    const productList = fixture.debugElement.query(By.css('bp-product-list'));
    expect(productList).toBeTruthy();
  });
}); 