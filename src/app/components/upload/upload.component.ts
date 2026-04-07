// components/upload/upload.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UploadService } from 'src/app/services//upload/upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFiles: File[] = [];
  previewUrls: (string | null)[] = [];
  selectedIndex: number = 0;

  isLoading: boolean = false;
  uploadProgress: number = 0;
  statusMessages: string[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  private allowedPdfType = 'application/pdf';
  private maxSizeMB = 10;
  private maxSizeBytes = this.maxSizeMB * 1024 * 1024;
  private maxFiles = 10;

  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  get hasMultipleItemsWithPreview(): boolean {
    return this.selectedFiles.length > 1 && this.previewUrls.some(url => url !== null);
  }

  canAddMoreFiles(): boolean {
    if (this.isLoading) return false;
    const hasPdf = this.selectedFiles.some(f => f.type === this.allowedPdfType);
    if (hasPdf) return false;
    return this.selectedFiles.length < this.maxFiles;
  }

  openFilePicker(): void {
    const input = document.getElementById('mainFileInput') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  openAddMoreFilePicker(): void {
    const input = document.getElementById('addMoreFileInput') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const validationError = this.validateFiles(files);
    if (validationError) {
      this.errorMessage = validationError;
      input.value = '';
      return;
    }

    this.clearPreviews();
    this.selectedFiles = files;
    this.generatePreviews(files);
    this.selectedIndex = 0;
    this.errorMessage = '';
    input.value = '';
  }

  onAddMoreFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const newFiles = Array.from(input.files);
    
    // Check if we already have a PDF
    const hasPdf = this.selectedFiles.some(f => f.type === this.allowedPdfType);
    if (hasPdf) {
      this.errorMessage = 'Cannot add more files. PDF already selected (max 1 file).';
      input.value = '';
      return;
    }

    // Check total count limit
    if (this.selectedFiles.length + newFiles.length > this.maxFiles) {
      this.errorMessage = `Cannot add ${newFiles.length} file(s). You already have ${this.selectedFiles.length} file(s). Max ${this.maxFiles} files allowed.`;
      input.value = '';
      return;
    }

    // Validate each new file
    for (const file of newFiles) {
      if (file.size > this.maxSizeBytes) {
        this.errorMessage = `File "${file.name}" exceeds ${this.maxSizeMB} MB.`;
        input.value = '';
        return;
      }
      if (!this.allowedImageTypes.includes(file.type)) {
        this.errorMessage = `File "${file.name}" is not an allowed image type. Only JPG, PNG allowed when not uploading a PDF.`;
        input.value = '';
        return;
      }
    }

    // Add new files
    const allFiles = [...this.selectedFiles, ...newFiles];
    this.selectedFiles = allFiles;
    this.generatePreviews(this.selectedFiles);
    
    // Select the first newly added file
    if (newFiles.length > 0) {
      this.selectedIndex = this.selectedFiles.length - newFiles.length;
    }
    
    this.errorMessage = '';
    input.value = '';
  }

  private validateFiles(files: File[]): string | null {
    for (const file of files) {
      if (file.size > this.maxSizeBytes) {
        return `File "${file.name}" exceeds ${this.maxSizeMB} MB.`;
      }
    }

    const images = files.filter(f => this.allowedImageTypes.includes(f.type));
    const pdfs = files.filter(f => f.type === this.allowedPdfType);

    if (pdfs.length > 0) {
      if (files.length !== 1) return 'When uploading a PDF, you can only select that single file.';
      if (pdfs.length !== 1) return 'Invalid PDF file.';
    } else {
      if (images.length !== files.length) return 'Only image files (JPG, PNG) are allowed when not uploading a PDF.';
      if (images.length > this.maxFiles) return `You can upload at most ${this.maxFiles} images.`;
    }
    return null;
  }

  private generatePreviews(files: File[]): void {
    this.clearPreviews();
    this.previewUrls = files.map(file => {
      if (this.allowedImageTypes.includes(file.type)) {
        return URL.createObjectURL(file);
      }
      return null;
    });
  }

  removeFile(index: number): void {
    if (this.previewUrls[index]) {
      URL.revokeObjectURL(this.previewUrls[index]!);
    }
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.selectedIndex = 0;
    } else if (this.selectedIndex >= this.selectedFiles.length) {
      this.selectedIndex = this.selectedFiles.length - 1;
    }
  }

  clearAll(): void {
    this.clearPreviews();
    this.selectedFiles = [];
    this.previewUrls = [];
    this.selectedIndex = 0;
    this.statusMessages = [];
    this.uploadProgress = 0;
  }

  private clearPreviews(): void {
    this.previewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
  }

  selectFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedIndex = index;
    }
  }

  processImage(): void {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'No file selected.';
      return;
    }

    this.isLoading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';
    this.statusMessages = [];

    this.uploadService.uploadFiles(this.selectedFiles).subscribe({
      next: (response) => {
        if (response.body && response.body.batchId) {
          this.startListening(response.body.batchId);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Upload failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private startListening(batchId: string): void {
    this.uploadService.listenToStatus(batchId).subscribe({
      next: (data: any) => {
        console.log('SSE data:', data);
        this.statusMessages.push(`✅ Processing completed for batch ${data.batchId}`);
        this.fetchResult(batchId);
      },
      error: (err: any) => {
        console.error('SSE error', err);
        this.errorMessage = 'Lost connection to status updates.';
        this.isLoading = false;
      },
      complete: () => {
        if (this.isLoading) {
          console.log('SSE connection closed, fetching result...');
          this.fetchResult(batchId);
        }
      }
    });
  }

  private fetchResult(batchId: string): void {
    // Replace with actual result fetching logic
    this.navigateToResult('Extracted Urdu text will appear here...');
  }

  private navigateToResult(extractedText: string): void {
    const filesData = this.selectedFiles.map((file, index) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: this.previewUrls[index]
    }));

    this.router.navigate(['/ocr-result'], {
      state: {
        files: filesData,
        extractedText: extractedText
      }
    });

    this.clearAll();
    this.isLoading = false;
  }

  logout(): void {
    this.authService.logout();
  }
}