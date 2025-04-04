import { Router } from 'express';
import {createAddress, getAddress, getAllAddresses} from '../controllers/address.controller'
import { validateAddress } from '../middlewares/validators'
import { authenticateToken } from  '../middlewares/authenticate';

    const addressRouter = Router();

addressRouter.get('/', getAllAddresses);
addressRouter.get('/:id', getAddress);
addressRouter.post('/', validateAddress, authenticateToken, createAddress);

export default addressRouter;