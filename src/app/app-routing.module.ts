import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLandingComponent } from './components/pages/app-landing/app-landing.component';
import { BookLandingComponent } from './components/pages/book-landing/book-landing.component';
import { SaasLandingComponent } from './components/pages/saas-landing/saas-landing.component';
import { ProductsLandingComponent } from './components/pages/products-landing/products-landing.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RecorridoComponent } from './components/pages/recorrido/recorrido.component';

const routes: Routes = [
    {path: '', component: AppLandingComponent},
    {path: 'book-landing', component: BookLandingComponent},
    {path: 'saas-landing', component: SaasLandingComponent},
    {path: 'products-landing', component: ProductsLandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'recorrido', component: RecorridoComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}