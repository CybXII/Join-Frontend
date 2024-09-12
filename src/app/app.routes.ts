import { ResolveFn, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BoardComponent } from './board/board.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { SummaryComponent } from './summary/summary.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { HelpSiteComponent } from './help-site/help-site.component';
import { ExtPrivacyComponent } from './ext-privacy/ext-privacy.component';
import { ExtLegalComponent } from './ext-legal/ext-legal.component';
import { JoinComponent } from './join/join.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
    children: [
        {
            path: 'join/login',
            title: 'login',
            component: LoginFormComponent,
        },
        {
            path: 'join/signup',
            title: 'signup',
            component: SignupFormComponent,
        },
        {
            path: 'join/signup/login',
            redirectTo: 'login',
            pathMatch: 'full',
        },
    ],
    },
    {
        path: 'join/signup/ext_privacy',
        redirectTo: 'ext_privacy', 
        pathMatch: 'full'       
    },
    {
        path: 'join/login/ext_privacy',
        redirectTo: 'ext_privacy', 
        pathMatch: 'full'       
    },
    {
        path: 'join/ext_privacy',
        title: 'ext_privacy',
        component: ExtPrivacyComponent,
    },
    {
        path: 'join/signup/ext_legal',
        redirectTo: 'ext_legal', 
        pathMatch: 'full'       
    },
    {
        path: 'join/login/ext_legal',
        redirectTo: 'ext_legal', 
        pathMatch: 'full'       
    },
    {
        path: 'join/ext_legal',
        title: 'ext_legal',
        component: ExtLegalComponent,
    },
    {
    path: 'join',
    component: JoinComponent,
    children: [
        {
            path: 'summary',
            component: SummaryComponent,
        },
        {
            path: 'summary/tasks',
            redirectTo: 'tasks',
        },
        {
            path: 'tasks/addTask',
            redirectTo: 'tasks',
        },

        {
            path: 'addTask',
            component: AddTaskComponent,
        },
        {
            path: 'tasks',
            component: BoardComponent,
        },
        {
            path: 'contacts',
            component: ContactsComponent,
        },
        {
            path: 'privacy',
            component: PrivacyComponent,
        },
        {
            path: 'legal_notice',
            component: LegalNoticeComponent,
        },
        {
            path: 'help',
            component: HelpSiteComponent,
        },
    ],
    },
    { path: '', redirectTo: 'join/login', pathMatch: 'full' },

    { path: '**', redirectTo: 'join/login', pathMatch: 'full' },
];