import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as moment from 'moment-business-days';

@Injectable({
  providedIn: 'root'
})

export class ExchangeService {

  private historicalRatesSource = new BehaviorSubject([]);
  historicalRates = this.historicalRatesSource.pipe(filter((val, i) => i > 0));

  constructor(private http: HttpClient) { }

  getExchangeRate(base, to) {
    return this.http.get(`https://api.exchangeratesapi.io/latest?base=${base}&symbols=${to}`);
  }

  getHistoricalRates(base, to) {
    let endDate = moment().format('YYYY-M-D');
    let startDate = moment().businessSubtract(31).format('YYYY-M-D');

    this.http.get(`https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&base=${base}&symbols=${to}`)
    .subscribe((data: ExchangeService) => {
      let newGraphPoints = this.calculateNewGraphPoints(data, to);
      this.historicalRatesSource.next(newGraphPoints);
    });
  }

  private calculateNewGraphPoints(data, to) {
    let exchangeRange = this.getMinMax(data['rates'], to);

    let newGraphPoints = Object.keys(data['rates']).sort().reduce((arr, currentDate, i) => {
      let adjustedY = this.getAdjustedY(exchangeRange, data['rates'], to, currentDate);

      arr.push({
        value: data['rates'][currentDate][to],
        position: {
          x: (window.innerWidth / Object.keys(data['rates']).length) * i,
          y: 300 - adjustedY
        }
      });

      return arr;
    }, []);
    
    return newGraphPoints;
  }

  private getMinMax(rates, to) {
    let min = null;
    let max = 0;

    Object.keys(rates).forEach(current => {
      if(min === null || rates[current][to] < min) {
        min = rates[current][to];
      } 

      if(rates[current][to] > max) {
        max = rates[current][to];
      }
    });

    return {min, max};
  }

  private getAdjustedY(exchangeRange, rates, to, currentDate) {
    let adjustedY = null;

    if(exchangeRange.max - exchangeRange.min === 0) {
      adjustedY = 1;
    } else {
      adjustedY = (((rates[currentDate][to] - exchangeRange.min) * (300 - 1)) / (exchangeRange.max - exchangeRange.min)) + 1;
    }

    return adjustedY;
  }
}