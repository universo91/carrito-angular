import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  // Estrategia de deteccion de cambios con OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductComponent  {

  @Input() product!: Product

  // agregarProductCarrito es un evento personalizado
  @Output() agregarProductCarrito = new EventEmitter<Product>();

  constructor() { }


  onClick():void {
    this.agregarProductCarrito.emit( this.product );
  }

}
