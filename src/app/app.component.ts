import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fyp';
  isRootUrl: boolean = false;

  constructor(private router: Router, private api: ApiService) {
    // Listen to router events and check if the current URL is the root
    this.router.events.subscribe(() => {
      this.checkIfRootUrl();
    });
  }

  ngOnInit(): void {
    // this.api.get('/').subscribe({
    //   next: (res) => {
    //     console.log('Backend connected:', res);
    //   },
    //   error: (err) => {
    //     console.error('Backend connection failed:', err);
    //   }
    // });
  }

  // Function to check if the URL is the root URL
  checkIfRootUrl(): void {
    const currentUrl = this.router.url;
    this.isRootUrl = currentUrl === '/';  // Checks if the URL is exactly '/'
  }
}
