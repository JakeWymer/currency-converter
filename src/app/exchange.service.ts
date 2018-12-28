import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';

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
    const DATE_FORMAT = 'YYYY-M-D'; 
    const tomorrow = moment().add(1, 'd');
    const endDate = this.getPreviousBusinessDay(tomorrow);
    let dayCount = 0;
    let startDate = moment(tomorrow);

    while(dayCount < 30) {
      startDate = moment(startDate.subtract(1, 'day'));

      if(this.isWorkday(startDate)) {
        dayCount += 1;
      }
    }

    const startDateString = startDate.format(DATE_FORMAT);
    const endDateString = endDate.format(DATE_FORMAT);

    this.http.get(`https://api.exchangeratesapi.io/history?start_at=${startDateString}&end_at=${endDateString}&base=${base}&symbols=${to}`)
    .subscribe((data: ExchangeService) => {
      let newGraphPoints = this.calculateNewGraphPoints(data, to);
      this.historicalRatesSource.next(newGraphPoints);
    });
  }

  private isWorkday(currentDay) {
    return currentDay.weekday() !== 0 && currentDay.weekday() !==6 && !this.checkIsHoliday(currentDay._d)
  }

  private getPreviousBusinessDay(day) {
    let prevDay = null;
    let currentDay = moment(day);

    while(!prevDay) {
      if(this.isWorkday(currentDay)) {
        prevDay = currentDay;
      } else {
        currentDay = currentDay.subtract(1, 'day');
      }
    }

    return prevDay;
  }

  private calculateNewGraphPoints(data, to) {
    let exchangeRange = this.getMinMax(data['rates'], to);

    return Object.keys(data['rates']).sort().map((currentDate, i) => {
      let adjustedY = this.getAdjustedY(exchangeRange, data['rates'], to, currentDate);
      return {
        value: `${currentDate.slice(5)}\n${data['rates'][currentDate][to].toFixed(4)}`,
        position: {
          x: (window.innerWidth / Object.keys(data['rates']).length) * i,
          y: 300 - adjustedY
        }
      };
    });    
  }

  private checkIsHoliday(date) { // Needs to be adjusted to only list TARGET holidays
    var _holidays = {
          'M': {
              '01/01': "New Year's Day",
              '12/25': "Christmas Day",
              '12/26': "Christmas Holiday"
          },
          'W': {
              '1/3/1': "Martin Luther King Jr. Day",
              '2/3/1': "Washington's Birthday",
              '5/5/1': "Memorial Day",
              '9/1/1': "Labor Day",
              '10/2/1': "Columbus Day",
              '11/4/4': "Thanksgiving Day"
          }
      };
    var diff = 1+ (0 | (new Date(date).getDate() - 1) / 7);
    var memorial = (new Date(date).getDay() === 1 && (new Date(date).getDate() + 7) > 30) ? "5" : null;
      
    return (_holidays['M'][moment(date).format('MM/DD')] || _holidays['W'][moment(date).format('M/'+ (memorial || diff) +'/d')]);
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

  //Map Y values to new values within 1-max canvas height
  private getAdjustedY(exchangeRange, rates, to, currentDate) {
    const MAX_CANVAS_Y_VALUE = 300;
    let adjustedY = null;

    if(exchangeRange.max - exchangeRange.min === 0) {
      adjustedY = 1;
    } else {
      adjustedY = (((rates[currentDate][to] - exchangeRange.min) * (MAX_CANVAS_Y_VALUE - 1)) / (exchangeRange.max - exchangeRange.min)) + 1;
    }

    return adjustedY;
  }
}