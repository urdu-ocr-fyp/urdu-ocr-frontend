import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

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
  errorMessage: string = '';
  successMessage: string = '';

  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  private allowedPdfType = 'application/pdf';
  private maxSizeMB = 10;
  private maxSizeBytes = this.maxSizeMB * 1024 * 1024;

  constructor(private authService: AuthService) {}

  // ✅ Getter for the template – avoids calling .some() directly in the template
  get hasMultipleItemsWithPreview(): boolean {
    return this.selectedFiles.length > 1 && this.previewUrls.some(url => url !== null);
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

  private validateFiles(files: File[]): string | null {
    for (const file of files) {
      if (file.size > this.maxSizeBytes) {
        return `File "${file.name}" exceeds ${this.maxSizeMB} MB.`;
      }
    }

    const images = files.filter(f => this.allowedImageTypes.includes(f.type));
    const pdfs = files.filter(f => f.type === this.allowedPdfType);

    if (pdfs.length > 0) {
      if (files.length !== 1) {
        return 'When uploading a PDF, you can only select that single file.';
      }
      if (pdfs.length !== 1) {
        return 'Invalid PDF file.';
      }
    } else {
      if (images.length !== files.length) {
        return 'Only image files (JPG, PNG) are allowed when not uploading a PDF.';
      }
      if (images.length > 10) {
        return 'You can upload at most 10 images.';
      }
    }
    return null;
  }

  private generatePreviews(files: File[]): void {
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
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = `Successfully processed ${this.selectedFiles.length} file(s). (Mock)`;
      setTimeout(() => this.clearAll(), 3000);
    }, 2000);
  }

  logout(): void {
    this.authService.logout();
  }
}
