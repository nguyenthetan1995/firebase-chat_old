import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

// Send unauthorized users to login
const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/']);

// Automatically log in users
const redirectLoggedInToChat = () => redirectLoggedInTo(['/chat']);
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pases/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToChat)
  },
  {
    path: 'chat',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./pases/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'message',
    loadChildren: () => import('./pases/message/message.module').then( m => m.MessagePageModule)
  },  {
    path: 'photo',
    loadChildren: () => import('./photo/photo.module').then( m => m.PhotoPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
