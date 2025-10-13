import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLandingComponent } from './components/pages/app-landing/app-landing.component';
import { BookLandingComponent } from './components/pages/book-landing/book-landing.component';
import { SaasLandingComponent } from './components/pages/saas-landing/saas-landing.component';
import { ProductsLandingComponent } from './components/pages/products-landing/products-landing.component';

const routes: Routes = [
    {path: '', component: AppLandingComponent},
    {path: 'book-landing', component: BookLandingComponent},
    {path: 'saas-landing', component: SaasLandingComponent},
    {path: 'products-landing', component: ProductsLandingComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}