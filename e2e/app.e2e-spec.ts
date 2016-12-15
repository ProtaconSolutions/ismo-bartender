import { IsmoBartenderPage } from './app.po';

describe('ismo-bartender App', function() {
  let page: IsmoBartenderPage;

  beforeEach(() => {
    page = new IsmoBartenderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
