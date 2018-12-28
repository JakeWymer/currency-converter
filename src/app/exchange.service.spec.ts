import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ExchangeService } from './exchange.service';
import * as moment from 'moment-business-days';

describe('ExchangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ExchangeService = TestBed.get(ExchangeService);
    expect(service).toBeTruthy();
  });
  
  it('should return array of new nodes', inject([HttpTestingController, ExchangeService],(httpMock, service) => {
    service.historicalRates.subscribe(rates => {
      let containsRateObjects = rates.every(node => {
        return node.data.hasOwnProperty('value') && node.hasOwnProperty('position');
      });

      expect(Array.isArray(rates)).toBeTruthy();
      expect(rates.length).toEqual(1);
      expect(containsRateObjects).toBeTruthy();
    });

    service.getHistoricalRates('USD', 'USD');

    let endDate = moment().format('YYYY-M-D');
    let startDate = moment().businessSubtract(31).format('YYYY-M-D');

    const req = httpMock.expectOne(`https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&base=USD&symbols=USD`);
    
    expect(req.request.method).toEqual('GET');

    req.flush({
      "end_at":"2018-11-28",
      "rates":{
        "2018-11-28":{
          "USD": 1.0
        }
      },
      "start_at":"2018-11-28",
      "base":"USD"
    });
    
  }));

});

