import { Routes } from '@angular/router';
import { provideAuth } from './auth.providers';
import { codeSentGuard, codeVerifiedGuard } from './forgot-password/password-reset.guards';
import { PASSWORD_RESET_SEGMENT } from './forgot-password/password-reset.state';
import { registrationStepGuard } from './register/register-flow.guards';

import { AuthLayoutComponent } from './ui/components/auth-layout/auth-layout.component';
import { ChangePasswordPageComponent } from './ui/pages/change-password/change-password.page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    providers: [provideAuth()],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login-page').then((m) => m.LoginPage),
      },
      {
        /**
         * /auth/register  →  child router-outlet renders the step pages.
         * Navigating to /auth/register alone redirects to /auth/register/account.
         */
        path: 'register',
        children: [
          { path: '', redirectTo: 'account', pathMatch: 'full' },
          {
            path: 'account',
            loadComponent: () =>
              import(
                './register/pages/account/register-account.page'
              ).then((m) => m.RegisterAccountPage),
          },
          {
            path: 'gender',
            canActivate: [registrationStepGuard('gender')],
            loadComponent: () =>
              import(
                './register/pages/gender/register-gender.page'
              ).then((m) => m.RegisterGenderPage),
          },
          {
            path: 'age',
            canActivate: [registrationStepGuard('age')],
            loadComponent: () =>
              import(
                './register/pages/age/register-age.page'
              ).then((m) => m.RegisterAgePage),
          },
          {
            path: 'weight',
            canActivate: [registrationStepGuard('weight')],
            loadComponent: () =>
              import(
                './register/pages/weight/register-weight.page'
              ).then((m) => m.RegisterWeightPage),
          },
          {
            path: 'height',
            canActivate: [registrationStepGuard('height')],
            loadComponent: () =>
              import(
                './register/pages/height/register-height.page'
              ).then((m) => m.RegisterHeightPage),
          },
          {
            path: 'goal',
            canActivate: [registrationStepGuard('goal')],
            loadComponent: () =>
              import(
                './register/pages/goal/register-goal.page'
              ).then((m) => m.RegisterGoalPage),
          },
          {
            path: 'activity',
            canActivate: [registrationStepGuard('activity')],
            loadComponent: () =>
              import(
                './register/pages/register-physical-activity.page/register-physical-activity.page'
              ).then((m) => m.RegisterPhysicalActivityPage),
          },
        ],
      },
      {
        /**
         * /auth/forgot-password → /otp → /reset-password.
         * Each later step is guarded by PasswordResetState.
         */
        path: PASSWORD_RESET_SEGMENT,
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './forgot-password/forgot-password-page/forgot-password-page'
              ).then((m) => m.ForgotPasswordPage),
          },
          {
            path: 'otp',
            canActivate: [codeSentGuard],
            loadComponent: () =>
              import(
                './forgot-password/verify-code-page/verify-code-page'
              ).then((m) => m.VerifyCodePage),
          },
          {
            path: 'reset-password',
            canActivate: [codeVerifiedGuard],
            loadComponent: () =>
              import(
                './forgot-password/reset-password-page/reset-password-page'
              ).then((m) => m.ResetPasswordPage),
          },
        ],
      },
      { path: 'verify-reset-code', redirectTo: PASSWORD_RESET_SEGMENT },
      { path: 'reset-password', redirectTo: PASSWORD_RESET_SEGMENT },
      {
        path: 'change-password',
        component: ChangePasswordPageComponent,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

export const authRoutes = AUTH_ROUTES;
