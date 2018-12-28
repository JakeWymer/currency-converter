import { Component, OnInit } from '@angular/core';
import {ExchangeService} from '../exchange.service';
import { EXCHANGE_SYMBOLS } from '../exchange-symbols';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})

export class ConverterComponent implements OnInit {

  fromInput = '';
  toInput = '';
  conversionRate = 1;
  symbols = EXCHANGE_SYMBOLS;
  toSelected = EXCHANGE_SYMBOLS[0];
  fromSelected = EXCHANGE_SYMBOLS[0];

  constructor(private exhangeService: ExchangeService) { }
  
  ngOnInit() {
  }
  
  convertCurrency(event, inputField) {
    if(event.target.value.length > 0) {
      if(inputField === 'from') {
        this.toInput = (parseFloat(this.fromInput) * this.conversionRate).toString();
      } else {
        this.fromInput = (parseFloat(this.toInput) / this.conversionRate).toString();
      }
    } else {
      this.toInput = this.fromInput = '';
    }
  }

  handleDropdown() {
    this.exhangeService.getExchangeRate(this.fromSelected, this.toSelected)
      .subscribe((data: ExchangeService) => {
        this.conversionRate = data['rates'][this.toSelected];
        this.toInput = this.fromInput = '';
      });
    
    this.exhangeService.getHistoricalRates(this.fromSelected, this.toSelected);
  }
}