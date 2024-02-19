import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateOfferDto } from './index.js';


export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
