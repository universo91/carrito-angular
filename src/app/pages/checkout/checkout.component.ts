import { Component, OnInit } from '@angular/core';
import { DataService } from '../products/services/data.service';
import { Store } from '../../shared/interfaces/store.interface';
import { delay, switchMap, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Order, Details } from '../../shared/interfaces/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  model= {
    name:'',
    store:'',
    shippingAddress:'',
    city: ''
  };

  isDelivery: boolean = true;
  cart: Product[] = [];
  stores: Store[] = [];

  constructor(
    private dataService: DataService,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductsService,
    private router: Router
  ) {
    this.checkIfCartIsEmpty();
  }

  ngOnInit(): void {

    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value: boolean): void{
    this.isDelivery = value;
  }
  /* NgForm es parecido a serialize de js, que trae toda la data del formulario, es un objeto
    inmenso, pero solo nos interesa su propiedad value, por eso hacemos la desestructuracion,
    pero a parte traes muchas
    cosas mas
    Renombramos a value como formData
  */

  onSubmit({value: formData}: NgForm): void {
    console.log("submit");
    const data:Order = {
      ...formData,
      date: this.getCurrentDay,
      isDelivery: this.isDelivery
    };
    /**
     * switchMap es uan funcion de alto nivel: Una funcion de alto nivel es una funcion que, o bien
     * devuelve otra funcion, o acepta una funcion como parametro.
     * Los operadores de alto nivel se usan usan para manejar un Observable de Observables. En concreto
     * switchMap retorna las notificaciones de un Observable interno.
     */
    this.dataService.saveOrder(data)
      .pipe(
        tap( res => console.log('Order -> ', res)),
        switchMap( ({id: orderId}) => {
          const details = this.prepareDetails();
          return this.dataService.saveDetailsOrder({details, orderId});
        }),
        tap( () => this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap( () => this.shoppingCartService.resetCart())
      )
      .subscribe();
  }

  private getCurrentDay(): string {
    /**
     * Convierte una fecha en una cadena utilizando la configuración regional actual o especificada.
     */
    return new Date().toLocaleDateString();
  }
  /**
   * El operador RxJS tap() es un operador de servicios públicos que devuelve una salida
   * observable que es idéntica a la fuente observable pero realiza un efecto secundario para
   * cada emisión en la fuente observable.
   * En otras palabras, puede decir que el operador RxJS tap() se usa para interceptar cada
   * emisión en la fuente observable y ejecuta una función pero devuelve una salida que es
   * idéntica a la fuente observable siempre que no encuentre ningún error.
   * Este operador generalmente se usa para depurar observables para los valores correctos
   * o realizar otros efectos secundarios.
   */
  private getStores(): void {
    this.dataService.getStores()
      .pipe(
        /* tap( res => console.log(res)) */

        tap( (store:Store[]) => this.stores = store)
      )
      .subscribe()
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach( (product: Product) => {
      const {id: productId, name: productName, cuantity: quantity, stock } = product;
      const updateStock = (stock - quantity);
      this.productService.updateStock(productId, updateStock)
        .pipe(

        )
        .subscribe();
      // Es imortante que los nombres de las propiedades sean igual al de la interfaz,
      // por eso es que se cambia previamente antes de añadir a Details
      details.push({productId, productName, quantity });
    });

    return details;
  }

  private getDataCart(): void {
    this.shoppingCartService.cartAction$
      .pipe(
        tap( (products: Product[]) => this.cart = products)
      )
      .subscribe();
  }

  /* cuando nuestro carrito esta vacio nos redigira a la ruta de products */
  private checkIfCartIsEmpty(): void {
    this.shoppingCartService.cartAction$
      .pipe(
        tap( (products: Product[]) => {
            if (Array.isArray(products) && !products.length) {
              this.router.navigate(['/products'])
            }
          }
        )
      )
      .subscribe();

  }
}
