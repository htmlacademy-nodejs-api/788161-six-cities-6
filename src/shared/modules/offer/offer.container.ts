import { Container } from 'inversify';
import { Component } from '../../models/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { types } from '@typegoose/typegoose';
import { DefaultOfferService, OfferEntity, OfferModel } from './index.js';


export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
