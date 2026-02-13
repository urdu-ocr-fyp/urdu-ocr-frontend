import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface FileData {
  name: string;
  size: number;
  type: string;
  previewUrl: string | null;
}

@Component({
  selector: 'app-ocr-result',
  templateUrl: './ocr-result.component.html',
  styleUrls: ['./ocr-result.component.css']
})
export class OcrResultComponent {
  files: FileData[] = [];
  extractedText: string = '';
  selectedFileIndex: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { files: FileData[], extractedText: string };
    if (state) {
      this.files = state.files || [];
      this.extractedText = state.extractedText || '';
    }
  }

  selectFile(index: number): void {
    this.selectedFileIndex = index;
  }

  getFileItemClasses(index: number): string {
    const baseClasses = 'flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200';
    if (this.selectedFileIndex === index) {
      return `${baseClasses} bg-cyan-500/20 border border-cyan-400`;
    }
    return `${baseClasses} bg-white/5`;
  }

  copyToClipboard(): void {
    if (!this.extractedText) return;
    navigator.clipboard.writeText(this.extractedText).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => console.error('Copy failed', err));
  }

  downloadAsTxt(): void {
    if (!this.extractedText) return;
    const blob = new Blob([this.extractedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-urdu-text.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  logout(): void {
    this.authService.logout();
  }
}