
import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js'; //RequestParams
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ParamOfferId } from './type/param-offerid.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, RequestBody, UpdateOfferDto>;
