import express, { Request, Response } from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/facade.factory';
import { PlaceOrderFacadeInputDto } from '../../../modules/checkout/facade/checkout.facade.interface';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const checkoutFacade = CheckoutFacadeFactory.create();

  try {
    const input: PlaceOrderFacadeInputDto = {
      clientId: req.body.clientId,
      products: req.body.products
    };

    console.log('input', input); // TODO: remove
    const output = await checkoutFacade.placeOrder(input);
    console.log('output', output); // TODO: remove

    res.status(201).send(output);
  } catch (error) {
    console.log('error', error); // TODO: remove
    res.status(500).send(error);
  }
});
