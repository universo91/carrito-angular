import { Component } from "@angular/core";
import { ShoppingCartService } from "../../services/shopping-cart.service";

// decorador component
@Component({
  selector: 'app-cart',
  template: `
    <ng-container *ngIf="{ total: total$ | async, quantity: quantity$ | async } as dataCart">
      <ng-container *ngIf="dataCart.total">
        <mat-icon>add_shopping_cart</mat-icon>
        {{ dataCart.total | currency}}
        ({{ dataCart.quantity }})
      </ng-container>
    </ng-container>
  `,
  styleUrls: []
})

export class CartComponent {

  quantity$ = this.shopinCartService.quantityAction$;
  total$ = this.shopinCartService.totalAction$;

  constructor( private shopinCartService: ShoppingCartService ) {}


}
