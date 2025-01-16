import { Router } from 'express';
import {createAddress, getAddress, getAllAddresses} from '../controllers/address.controller'
import { validateAddress } from '../middlewares/util-functions'

    const addressRouter = Router();

addressRouter.get('/', getAllAddresses);
addressRouter.get('/:id', getAddress);
addressRouter.post('/', validateAddress, createAddress);

export default addressRouter;