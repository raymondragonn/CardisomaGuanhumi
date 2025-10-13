import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { AppLandingComponent } from './components/pages/app-landing/app-landing.component';
import { PreloaderComponent } from './components/common/preloader/preloader.component';
import { BookLandingComponent } from './components/pages/book-landing/book-landing.component';
import { AppBannerComponent } from './components/pages/app-landing/app-banner/app-banner.component';
import { AppFeaturesComponent } from './components/pages/app-landing/app-features/app-features.component';
import { AppAboutComponent } from './components/pages/app-landing/app-about/app-about.component';
import { AppFunfactsComponent } from './components/pages/app-landing/app-funfacts/app-funfacts.component';
import { AppScreenshotsComponent } from './components/pages/app-landing/app-screenshots/app-screenshots.component';
import { AppPricingComponent } from './components/pages/app-landing/app-pricing/app-pricing.component';
import { AppNewsletterComponent } from './components/pages/app-landing/app-newsletter/app-newsletter.component';
import { AppTeamComponent } from './components/pages/app-landing/app-team/app-team.component';
import { AppFaqComponent } from './components/pages/app-landing/app-faq/app-faq.component';
import { AppFeedbackComponent } from './components/pages/app-landing/app-feedback/app-feedback.component';
import { AppDownloadComponent } from './components/pages/app-landing/app-download/app-download.component';
import { AppHowItWorksComponent } from './components/pages/app-landing/app-how-it-works/app-how-it-works.component';
import { AppContactComponent } from './components/pages/app-landing/app-contact/app-contact.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { BookBannerComponent } from './components/pages/book-landing/book-banner/book-banner.component';
import { BookFeaturesComponent } from './components/pages/book-landing/book-features/book-features.component';
import { BookAboutComponent } from './components/pages/book-landing/book-about/book-about.component';
import { BookFunfactsComponent } from './components/pages/book-landing/book-funfacts/book-funfacts.component';
import { BookPricingComponent } from './components/pages/book-landing/book-pricing/book-pricing.component';
import { BookNewsletterComponent } from './components/pages/book-landing/book-newsletter/book-newsletter.component';
import { BookFeedbackComponent } from './components/pages/book-landing/book-feedback/book-feedback.component';
import { BookContactComponent } from './components/pages/book-landing/book-contact/book-contact.component';
import { BookAuthorComponent } from './components/pages/book-landing/book-author/book-author.component';
import { SaasLandingComponent } from './components/pages/saas-landing/saas-landing.component';
import { SaasBannerComponent } from './components/pages/saas-landing/saas-banner/saas-banner.component';
import { SaasFeaturesComponent } from './components/pages/saas-landing/saas-features/saas-features.component';
import { SaasPartnerComponent } from './components/pages/saas-landing/saas-partner/saas-partner.component';
import { SaasContactComponent } from './components/pages/saas-landing/saas-contact/saas-contact.component';
import { SaasAppDownloadComponent } from './components/pages/saas-landing/saas-app-download/saas-app-download.component';
import { SaasFeedbackComponent } from './components/pages/saas-landing/saas-feedback/saas-feedback.component';
import { SaasTeamComponent } from './components/pages/saas-landing/saas-team/saas-team.component';
import { SaasNewsletterComponent } from './components/pages/saas-landing/saas-newsletter/saas-newsletter.component';
import { SaasPricingComponent } from './components/pages/saas-landing/saas-pricing/saas-pricing.component';
import { SaasOurStoryComponent } from './components/pages/saas-landing/saas-our-story/saas-our-story.component';
import { SaasDiscoverComponent } from './components/pages/saas-landing/saas-discover/saas-discover.component';
import { SaasAboutComponent } from './components/pages/saas-landing/saas-about/saas-about.component';
import { SaasFunfactsComponent } from './components/pages/saas-landing/saas-funfacts/saas-funfacts.component';
import { ProductsLandingComponent } from './components/pages/products-landing/products-landing.component';
import { ProductsBannerComponent } from './components/pages/products-landing/products-banner/products-banner.component';
import { ProductsAboutComponent } from './components/pages/products-landing/products-about/products-about.component';
import { ProductsFeaturesComponent } from './components/pages/products-landing/products-features/products-features.component';
import { ProductsSpecificationComponent } from './components/pages/products-landing/products-specification/products-specification.component';
import { ProductsDiscoverComponent } from './components/pages/products-landing/products-discover/products-discover.component';
import { ProductsUsersComponent } from './components/pages/products-landing/products-users/products-users.component';
import { ProductsContactComponent } from './components/pages/products-landing/products-contact/products-contact.component';
import { ProductsNewsletterComponent } from './components/pages/products-landing/products-newsletter/products-newsletter.component';
import { ProductsFeedbackComponent } from './components/pages/products-landing/products-feedback/products-feedback.component';
import { ProductsFaqComponent } from './components/pages/products-landing/products-faq/products-faq.component';
import { ProductsGalleryComponent } from './components/pages/products-landing/products-gallery/products-gallery.component';
import { OtherProductsComponent } from './components/pages/products-landing/other-products/other-products.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AppLandingComponent,
    PreloaderComponent,
    BookLandingComponent,
    AppBannerComponent,
    AppFeaturesComponent,
    AppAboutComponent,
    AppFunfactsComponent,
    AppScreenshotsComponent,
    AppPricingComponent,
    AppNewsletterComponent,
    AppTeamComponent,
    AppFaqComponent,
    AppFeedbackComponent,
    AppDownloadComponent,
    AppHowItWorksComponent,
    AppContactComponent,
    FooterComponent,
    BookBannerComponent,
    BookFeaturesComponent,
    BookAboutComponent,
    BookFunfactsComponent,
    BookPricingComponent,
    BookNewsletterComponent,
    BookFeedbackComponent,
    BookContactComponent,
    BookAuthorComponent,
    SaasLandingComponent,
    SaasBannerComponent,
    SaasFeaturesComponent,
    SaasPartnerComponent,
    SaasContactComponent,
    SaasAppDownloadComponent,
    SaasFeedbackComponent,
    SaasTeamComponent,
    SaasNewsletterComponent,
    SaasPricingComponent,
    SaasOurStoryComponent,
    SaasDiscoverComponent,
    SaasAboutComponent,
    SaasFunfactsComponent,
    ProductsLandingComponent,
    ProductsBannerComponent,
    ProductsAboutComponent,
    ProductsFeaturesComponent,
    ProductsSpecificationComponent,
    ProductsDiscoverComponent,
    ProductsUsersComponent,
    ProductsContactComponent,
    ProductsNewsletterComponent,
    ProductsFeedbackComponent,
    ProductsFaqComponent,
    ProductsGalleryComponent,
    OtherProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
