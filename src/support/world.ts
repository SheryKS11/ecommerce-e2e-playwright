import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { WishlistComparePage } from '../pages/WishlistComparePage';

// Browser can be set via BROWSER env variable: chromium | firefox | webkit
const BROWSER = (process.env.BROWSER || 'chromium').toLowerCase();
// Headless mode: true in CI, false locally for visibility
const HEADLESS = process.env.HEADLESS !== 'false';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  homePage!: HomePage;
  registerPage!: RegisterPage;
  loginPage!: LoginPage;
  accountPage!: AccountPage;
  searchResultsPage!: SearchResultsPage;
  productPage!: ProductPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;
  wishlistComparePage!: WishlistComparePage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    // Launch the browser specified by the BROWSER env variable
    if (BROWSER === 'firefox') {
      this.browser = await firefox.launch({ headless: HEADLESS });
    } else if (BROWSER === 'webkit') {
      this.browser = await webkit.launch({ headless: HEADLESS });
    } else {
      this.browser = await chromium.launch({ headless: HEADLESS });
    }
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: `reports/videos/${BROWSER}`,
        size: { width: 1280, height: 720 }
      }
    });
    this.page = await this.context.newPage();
    this.initPages();
  }

  initPages() {
    this.homePage = new HomePage(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.accountPage = new AccountPage(this.page);
    this.searchResultsPage = new SearchResultsPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
    this.wishlistComparePage = new WishlistComparePage(this.page);
  }

  async destroy() {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
