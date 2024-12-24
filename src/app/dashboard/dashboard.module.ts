import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SearchHomeComponent } from './components/search-home/search-home.component';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { EgyptPageComponent } from './components/categories-pages/egypt-page/egypt-page.component';
import { BeachesPageComponent } from './components/categories-pages/beaches-page/beaches-page.component';
import { CategPageComponent } from './components/categories-pages/categ-page/categ-page.component';
import { CitiesPageComponent } from './components/categories-pages/cities-page/cities-page.component';
import { SportsPageComponent } from './components/categories-pages/sports-page/sports-page.component';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchHomeComponent,
    HomeComponent,
    HeroComponent,
    EgyptPageComponent,
    BeachesPageComponent,
    CategPageComponent,
    CitiesPageComponent,
    SportsPageComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    DashboardRoutingModule,
    SharedModule,
  ],
})
export class DashboardModule {}
