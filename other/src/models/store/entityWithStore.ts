import { IEntity } from "../base/entity";
import { IStore } from "../store";

export interface IEntityWithStore extends IEntity {
  storeId: string;
  store: IStore;
}
