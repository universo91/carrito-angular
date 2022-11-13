import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

// Decorador injectable
@Injectable({

  // La propiedad provideIn indica que este servicio estara disponible en toda la aplicacion
  // Esta ralacionada con la inyeccion de dependencias en angular
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = 'http://localhost:3000/products';
  constructor( private http: HttpClient ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  updateStock(productId: number, stock: number): Observable<any> {
    const body = {"stock": stock};
    return this.http.patch<any>(`${this.apiURL}/${productId}`, body);
  }
}
