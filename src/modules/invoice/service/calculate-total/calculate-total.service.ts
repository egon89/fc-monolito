import { CalculateTotalServiceInterface } from './calculate-total.service.interface';

export default class CalculateTotalService implements CalculateTotalServiceInterface {
  calculate(items: { price: number }[]): number {
    return items.reduce((acc, item) => acc + item.price, 0);
  }
}
