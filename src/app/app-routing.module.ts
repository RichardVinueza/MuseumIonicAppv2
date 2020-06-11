import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "splash", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "splash",
    loadChildren: () =>
      import("./pages/splash/splash.module").then((m) => m.SplashPageModule),
  },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
