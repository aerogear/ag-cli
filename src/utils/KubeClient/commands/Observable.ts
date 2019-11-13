import { Message, Observer } from './Observer';

export interface Observable {
  registerObserver(observer: Observer);
  removeObserver(observer: Observer);
  notify(message: Message);
}
