import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'] // if using SCSS
})
export class UploadComponent {
  // // File handling
  // selectedFile: File | null = null;
  // previewUrl: string | ArrayBuffer | null = null;
  // selectedFileName: string = '';
  // selectedFileSize: string = '';

  // // UI states
  // isLoading = false;
  // errorMessage = '';
  // successMessage = '';

  // constructor(
  //   private http: HttpClient,
  //   private router: Router
  // ) {}

  // /**
  //  * Triggered when user selects a file via input or dropzone
  //  */
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     this.validateAndPreview(file);
  //   }
  // }

  // /**
  //  * Validate file type/size and generate preview
  //  */
  // private validateAndPreview(file: File): void {
  //   // Reset previous messages
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   // 1. Type validation (images + PDF)
  //   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  //   if (!allowedTypes.includes(file.type)) {
  //     this.errorMessage = 'Unsupported file format. Please upload JPG, PNG, or PDF.';
  //     return;
  //   }

  //   // 2. Size validation (max 10 MB)
  //   const maxSize = 10 * 1024 * 1024; // 10 MB
  //   if (file.size > maxSize) {
  //     this.errorMessage = 'File is too large. Maximum size is 10 MB.';
  //     return;
  //   }

  //   // 3. Store file info
  //   this.selectedFile = file;
  //   this.selectedFileName = file.name;
  //   this.selectedFileSize = this.formatFileSize(file.size);

  //   // 4. Generate preview (for images)
  //   if (file.type.startsWith('image/')) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       this.previewUrl = e.target?.result ?? null;
  //     };
  //     reader.readAsDataURL(file);
  //   } else if (file.type === 'application/pdf') {
  //     // Show a PDF icon instead of actual preview (optional)
  //     this.previewUrl = 'assets/pdf-placeholder.svg'; // You can replace with a PDF icon
  //   }
  // }

  // /**
  //  * Remove current file and reset state
  //  */
  // clearPreview(): void {
  //   this.selectedFile = null;
  //   this.previewUrl = null;
  //   this.selectedFileName = '';
  //   this.selectedFileSize = '';
  //   this.errorMessage = '';
  //   this.successMessage = '';
  // }

  // /**
  //  * Send the image to the backend OCR API
  //  */
  // processImage(): void {
  //   if (!this.selectedFile) {
  //     this.errorMessage = 'No file selected.';
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   const formData = new FormData();
  //   formData.append('document', this.selectedFile);

  //   // 🔁 REPLACE WITH YOUR ACTUAL BACKEND ENDPOINT
  //   this.http.post('https://api.urduscript.com/ocr', formData)
  //     .subscribe({
  //       next: (response: any) => {
  //         this.isLoading = false;
  //         this.successMessage = 'Text extracted successfully! Redirecting...';
          
  //         // Optionally navigate to results page with response data
  //         // this.router.navigate(['/results'], { state: { ocrData: response } });
          
  //         // Reset after 2 seconds
  //         setTimeout(() => this.clearPreview(), 2000);
  //       },
  //       error: (error) => {
  //         this.isLoading = false;
  //         this.errorMessage = error.error?.message || 'Failed to process image. Please try again.';
  //         console.error('OCR API error:', error);
  //       }
  //     });
  // }

  // /**
  //  * Logout action – clear session and redirect to login
  //  */
  // logout(): void {
  //   // Clear authentication tokens, etc.
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']);
  // }

  // /**
  //  * Helper: format bytes to human readable size
  //  */
  // private formatFileSize(bytes: number): string {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  // }
}