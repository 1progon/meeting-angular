import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomepageComponent} from "./view/homepage/homepage.component";
import {HeaderComponent} from "./view/include/header/header.component";
import {FooterComponent} from "./view/include/footer/footer.component";
import {LeftSidebarComponent} from './view/include/left-sidebar/left-sidebar.component';
import {RightSidebarComponent} from './view/include/right-sidebar/right-sidebar.component';
import {PersonsIndexComponent} from './view/persons/persons-index/persons-index.component';
import {PersonsShowComponent} from './view/persons/persons-show/persons-show.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PaginationComponent} from './view/include/pagination/pagination.component';
import {PersonCardComponent} from './view/persons/include/person-card/person-card.component';
import {Error404Component} from './view/errors/error404/error404.component';
import {
  PersonCardPlaceholderComponent
} from './view/persons/include/person-card-placeholder/person-card-placeholder.component';
import {LoginComponent} from './view/auth/login/login.component';
import {RegisterComponent} from './view/auth/register/register.component';
import {LogoutComponent} from './view/auth/logout/logout.component';
import {FormsModule} from "@angular/forms";
import {BaseHeadersInterceptor} from "./interceptors/base-headers.interceptor";
import {AccountComponent} from './view/account/account/account.component';
import {DashboardComponent} from './view/account/dashboard/dashboard.component';
import {AccountSidebarComponent} from './view/account/include/account-sidebar/account-sidebar.component';
import {
  AccountPersonCreateComponent
} from './view/account/persons/account-person-create/account-person-create.component';
import {
  AccountPersonsIndexComponent
} from './view/account/persons/account-persons-index/account-persons-index.component';
import {ModalComponent} from './view/include/modal/modal.component';
import {PersonSendMessageComponent} from './view/persons/include/person-send-message/person-send-message.component';
import {
  AccountMessagesIndexComponent
} from './view/account/messages/account-messages-index/account-messages-index.component';
import {
  AccountMessagesShowComponent
} from './view/account/messages/account-message-show/account-messages-show.component';
import {
  AccountPersonEditBaseComponent
} from './view/account/persons/account-person-edit/account-person-edit-base/account-person-edit-base.component';
import {
  AccountPersonEditCharsComponent
} from './view/account/persons/account-person-edit/account-person-edit-chars/account-person-edit-chars.component';
import {
  AccountPersonEditComponent
} from './view/account/persons/account-person-edit/account-person-edit/account-person-edit.component';
import {
  AccountPersonSelectLocationComponent
} from './view/account/persons/include/account-person-select-location/account-person-select-location.component';
import {
  PersonShowPlaceholderComponent
} from './view/persons/include/person-show-placeholder/person-show-placeholder.component';
import {LayoutFullWidthComponent} from './view/layout/layout-full-width/layout-full-width.component';
import {LayoutWithSidebarsComponent} from './view/layout/layout-with-sidebars/layout-with-sidebars.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    PersonsIndexComponent,
    PersonsShowComponent,
    PaginationComponent,
    PersonCardComponent,
    Error404Component,
    PersonCardPlaceholderComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    AccountComponent,
    DashboardComponent,
    AccountSidebarComponent,
    AccountPersonCreateComponent,
    AccountPersonsIndexComponent,
    ModalComponent,
    PersonSendMessageComponent,
    AccountMessagesIndexComponent,
    AccountMessagesShowComponent,
    AccountPersonEditBaseComponent,
    AccountPersonEditCharsComponent,
    AccountPersonEditComponent,
    AccountPersonSelectLocationComponent,
    PersonShowPlaceholderComponent,
    LayoutFullWidthComponent,
    LayoutWithSidebarsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: BaseHeadersInterceptor,
    multi: true
  },],
  bootstrap: [AppComponent]
})
export class AppModule {
}
