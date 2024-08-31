import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
import { AddClientFacadeInputDto } from '../../../modules/client-adm/facade/client-adm.facade.interface';

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();

  try {
    const client: AddClientFacadeInputDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: req.body.address,
    };

    await clientFacade.add(client);

    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
