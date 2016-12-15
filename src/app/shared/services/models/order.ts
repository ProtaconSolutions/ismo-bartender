export class Order {
  state: number;
  recipe: number[];

  constructor(state: number, recipe: number[]) {
    this.state = state;
    this.recipe = recipe;
  }
}