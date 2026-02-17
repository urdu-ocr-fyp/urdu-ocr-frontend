import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fyp';
  isRootUrl: boolean = false;

  constructor(private router: Router) {
    // Listen to router events and check if the current URL is the root
    this.router.events.subscribe(() => {
      this.checkIfRootUrl();
    });
  }

  // Function to check if the URL is the root URL
  checkIfRootUrl(): void {
    const currentUrl = this.router.url;
    this.isRootUrl = currentUrl === '/';  // Checks if the URL is exactly '/'
  }
}
