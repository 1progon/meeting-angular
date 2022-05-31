import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PersonsIndexComponent} from "./view/persons/persons-index/persons-index.component";
import {PersonsShowComponent} from "./view/persons/persons-show/persons-show.component";
import {Error404Component} from "./view/errors/error404/error404.component";
import {LoginComponent} from "./view/auth/login/login.component";
import {RegisterComponent} from "./view/auth/register/register.component";
import {LogoutComponent} from "./view/auth/logout/logout.component";
import {AccountComponent} from "./view/account/account/account.component";
import {OnlyLoggedUserGuard} from "./guards/only-logged-user-guard.service";
import {DashboardComponent} from "./view/account/dashboard/dashboard.component";
import {
  AccountPersonCreateComponent
} from "./view/account/persons/account-person-create/account-person-create.component";
import {
  AccountPersonsIndexComponent
} from "./view/account/persons/account-persons-index/account-persons-index.component";
import {
  AccountMessagesIndexComponent
} from "./view/account/messages/account-messages-index/account-messages-index.component";
import {
  AccountMessagesShowComponent
} from "./view/account/messages/account-message-show/account-messages-show.component";
import {
  AccountPersonEditBaseComponent
} from "./view/account/persons/account-person-edit/account-person-edit-base/account-person-edit-base.component";
import {
  AccountPersonEditCharsComponent
} from "./view/account/persons/account-person-edit/account-person-edit-chars/account-person-edit-chars.component";
import {
  AccountPersonEditComponent
} from "./view/account/persons/account-person-edit/account-person-edit/account-person-edit.component";
import {HomepageComponent} from "./view/homepage/homepage.component";
import {LayoutFullWidthComponent} from "./view/layout/layout-full-width/layout-full-width.component";
import {LayoutWithSidebarsComponent} from "./view/layout/layout-with-sidebars/layout-with-sidebars.component";

const routes: Routes = [

  // Routes without sidebar
  {
    path: '', component: LayoutFullWidthComponent, children: [

      // Homepage
      {path: '', component: HomepageComponent, data: {title: 'Homepage', route: 'homepage'}},

      // Auth
      {path: 'login', component: LoginComponent, data: {title: 'Login Form', route: 'login'}},
      {path: 'register', component: RegisterComponent, data: {title: 'Register Form', route: 'register'}},
      {path: 'logout', component: LogoutComponent, data: {title: 'Logout', route: 'logout'}},

      // Account, only logged users
      {
        path: 'account', component: AccountComponent,
        canActivate: [OnlyLoggedUserGuard],
        children: [
          {path: '', component: DashboardComponent},
          {path: 'persons', redirectTo: 'persons/page/1', pathMatch: 'full'},
          {path: 'persons/page/:pageId', component: AccountPersonsIndexComponent},
          {path: 'person/create', component: AccountPersonCreateComponent},
          {
            path: 'person/edit/:id', component: AccountPersonEditComponent, children: [
              {path: '', component: AccountPersonEditBaseComponent},
              {path: 'chars', component: AccountPersonEditCharsComponent},
              {path: 'phones', component: AccountPersonEditCharsComponent},
              {path: 'rates', component: AccountPersonEditCharsComponent},
              {path: 'services', component: AccountPersonEditCharsComponent},
              {path: 'images', component: AccountPersonEditCharsComponent},
            ]
          },
          {
            path: 'messages', component: AccountMessagesIndexComponent, children: [
              {path: ':id', component: AccountMessagesShowComponent}
            ]
          },
        ],
      },


    ]
  },


  // Routes with sidebar
  {
    path: '', component: LayoutWithSidebarsComponent,
    canActivate: [OnlyLoggedUserGuard],
    children: [
      // People
      {path: 'persons', redirectTo: '/persons/page/1', pathMatch: 'full'},
      {
        path: 'persons/page/:pageId', component: PersonsIndexComponent,
        data: {title: 'People - Page', route: 'persons-index'}
      },

      // People by country
      {
        path: 'persons/:countrySlug',
        redirectTo: '/persons/:countrySlug/page/1', pathMatch: 'full'
      },
      {
        path: 'persons/:countrySlug/page/:pageId',
        component: PersonsIndexComponent,
        data: {title: 'People In Country - Page', route: 'persons-index-country'}
      },

      // People by city
      {
        path: 'persons/:countrySlug/:citySlug',
        redirectTo: '/persons/:countrySlug/:citySlug/page/1',
        pathMatch: 'full'
      },
      {
        path: 'persons/:countrySlug/:citySlug/page/:pageId',
        component: PersonsIndexComponent,
        data: {title: 'People In City - Page', route: 'persons-index-city'}
      },

      // Show single person
      {path: 'person/:id', component: PersonsShowComponent, data: {title: 'People One', route: 'person-show'}},
    ]
  },

  // Routes without sidebar
  {
    path: '', component: LayoutFullWidthComponent, children: [
      // Error pages
      {path: '**', redirectTo: '404'},
      {path: '404', component: Error404Component},
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
