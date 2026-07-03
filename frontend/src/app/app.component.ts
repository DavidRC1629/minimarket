import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { environment } from '../environments/environment';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: Categoria;
}

interface Venta {
  id: number;
  cantidad: number;
  fecha: string;
  total: number;
  producto: Producto;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly environment = environment;
  categorias = signal<Categoria[]>([]);
  productos = signal<Producto[]>([]);
  ventas = signal<Venta[]>([]);
  selectedProductId = signal<number | null>(null);
  cantidad = signal<number>(1);
  message = signal<string>('');
  loading = signal<boolean>(false);

  get selectedProduct(): number | null {
    return this.selectedProductId();
  }

  set selectedProduct(value: number | null) {
    this.selectedProductId.set(value);
  }

  get selectedQuantity(): number {
    return this.cantidad();
  }

  set selectedQuantity(value: number) {
    this.cantidad.set(value);
  }

  constructor(private http: HttpClient) {
    this.cargarCategorias();
    this.cargarProductos();
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      this.message.set(`Error: ${error.message}`);
    } else {
      this.message.set('Error desconocido');
    }
  }

  cargarCategorias() {
    this.loading.set(true);
    this.message.set('');
    this.http.get<Categoria[]>(`${environment.apiUrl}/categorias`).subscribe({
      next: data => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }

  cargarProductos() {
    this.loading.set(true);
    this.message.set('');
    this.http.get<Producto[]>(`${environment.apiUrl}/productos`).subscribe({
      next: data => {
        this.productos.set(data);
        if (data.length > 0 && this.selectedProduct === null) {
          this.selectedProductId.set(data[0].id);
        }
        this.loading.set(false);
      },
      error: err => {
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }

  cargarVentas() {
    this.loading.set(true);
    this.message.set('');
    this.http.get<Venta[]>(`${environment.apiUrl}/ventas`).subscribe({
      next: data => {
        this.ventas.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }

  registrarVenta() {
    if (this.selectedProduct === null || this.cantidad() < 1) {
      this.message.set('Selecciona un producto válido y una cantidad mayor a 0.');
      return;
    }

        const body = {
          productoId: this.selectedProduct,
          cantidad: this.cantidad()
        };

    this.loading.set(true);
    this.http.post<Venta>(`${environment.apiUrl}/ventas`, body).subscribe({
      next: venta => {
        this.message.set(`Venta registrada con éxito (#${venta.id})`);
        this.cantidad.set(1);
        this.cargarProductos();
        this.cargarVentas();
        this.loading.set(false);
      },
      error: err => {
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }
}
