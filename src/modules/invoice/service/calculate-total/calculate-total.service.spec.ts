import CalculateTotalService from './calculate-total.service';

describe(CalculateTotalService.name, () => {
  let calculateTotalService: CalculateTotalService;

  beforeEach(() => {
    calculateTotalService = new CalculateTotalService();
  });

  describe(CalculateTotalService.prototype.calculate.name, () => {
    it('should return the sum of all prices', () => {
      const items = [
        { price: 10 },
        { price: 20 },
        { price: 30 },
      ];

      const total = calculateTotalService.calculate(items);

      expect(total).toBe(60);
    });
  });
});
