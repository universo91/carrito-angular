import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "src/app/pages/products/interfaces/product.interface";

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {

  products: Product[] = [];

  // Observable de tipo array de Product, un Subject puede actuar como observable y como observador
  // Subject tenemos acceso a futuros datos, pero si queremos el actual dato usamos BehaviorSubject
  // y ademas requiere un valor por defecto
  private cartSubject = new BehaviorSubject<Product[]>([]);

  // Observable de tipo numerico
  private totalSubject = new BehaviorSubject<number>(0);

  //Observable de tipo numerico
  private quantitySubject = new BehaviorSubject<number>(0);

  //Devolveremos estos observables hacia nuestra apliacion, para quien lo necesite consumir
  //Existe una convecion de que cuando trabajamos con observables le ponemos un $ al final
  get totalAction$(): Observable<number> {
    return this.totalSubject.asObservable();
  }

  get quantityAction$(): Observable<number> {
    return this.quantitySubject.asObservable();
  }

  get cartAction$(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }

  private calcTotal(): void {
    const total = this.products.reduce( (acumulador, product) => acumulador += product.price, 0);
    this.totalSubject.next( total );
  }

  private quantityProduct(): void {
    const quantity = this.products.reduce((acumulaodr,producto) => acumulaodr += producto.cuantity, 0);
    // Con el metodo next es que emitimos valores
    this.quantitySubject.next( quantity );
  }

  private addToCart(product: Product): void {
    /**
     * El find()método devuelve el primer elemento de la matriz proporcionada que satisface la
     * función de prueba proporcionada. Si ningún valor satisface la función de prueba,
     * undefinedse devuelve.
     */
    const isProductInCart = this.products.find( ({ id }) => id === product.id );

    if( isProductInCart ) {
      isProductInCart.cuantity += 1;
    } else {
      this.products.push({...product, cuantity: 1});
    }

    this.cartSubject.next(this.products);
  }

  updateCart(product: Product): void {
    this.addToCart( product );
    this.calcTotal();
    this.quantityProduct();
  }

  resetCart(): void {
    this.cartSubject.next([]);
    this.quantitySubject.next(0);
    this.totalSubject.next(0);
    this.products = [];
  }
}
