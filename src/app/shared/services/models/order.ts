export class Order {
  key?: string;
  state: number;
  recipe: number[];

  constructor(state: number, recipe: number[]) {
    this.state = state;
    this.recipe = recipe;
  }
}