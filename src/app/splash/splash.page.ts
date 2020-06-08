import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  splash = true;

  constructor(private route: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.splash = false; 
    }, 4000);
    setTimeout(() => {
      this.route.navigate(['/home']);
    }, 3000);
   
  }

}
