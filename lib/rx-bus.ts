import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface MarketTick {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  type: 'trade' | 'quote';
  bid?: number;
  ask?: number;
}

export interface AnomalyEvent {
  symbol: string;
  type: 'volume_spike' | 'price_shock' | 'regime_shift';
  severity: number; // 0 to 1
  timestamp: number;
}

class RxBus {
  private tickSubject = new Subject<MarketTick>();
  private anomalySubject = new Subject<AnomalyEvent>();

  publishTick(tick: MarketTick) {
    this.tickSubject.next(tick);
  }

  publishAnomaly(anomaly: AnomalyEvent) {
    this.anomalySubject.next(anomaly);
  }

  getTicks(symbol?: string): Observable<MarketTick> {
    if (symbol) {
      return this.tickSubject.asObservable().pipe(
        filter(tick => tick.symbol === symbol)
      );
    }
    return this.tickSubject.asObservable();
  }

  getAnomalies(symbol?: string): Observable<AnomalyEvent> {
    if (symbol) {
      return this.anomalySubject.asObservable().pipe(
        filter(anomaly => anomaly.symbol === symbol)
      );
    }
    return this.anomalySubject.asObservable();
  }

  getAllAnomalies(): Observable<AnomalyEvent> {
    return this.anomalySubject.asObservable();
  }
}

export const rxBus = new RxBus();
