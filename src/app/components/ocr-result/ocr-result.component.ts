import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { FileService } from 'src/app/services/file/file.service';

interface ProcessedFile {
  name: string;
  imageSrc: string;
  extractedText: string;
  rawExtractedText: string;
}

@Component({
  selector: 'app-ocr-result',
  templateUrl: './ocr-result.component.html',
  styleUrls: ['./ocr-result.component.css'],
  animations: [
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-10px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OcrResultComponent implements OnInit {
  files: ProcessedFile[] = [];
  selectedFileIndex: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';
  batchId: string | null = null;
  showDownloadMenu: boolean = false;
  isDownloading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public themeService: ThemeService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId');
    if (!this.batchId) {
      this.errorMessage = 'No batch ID provided.';
      this.isLoading = false;
      return;
    }
    this.fetchResults();
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.download-menu-container')) {
      this.showDownloadMenu = false;
    }
  }

  fetchResults(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fileService.fetchResult(this.batchId!).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('response', response);

        if (response?.data?.results && Array.isArray(response.data.results)) {
          this.files = response.data.results.map((item: any) => {
            let extractedTextPlain = '';
            if (item.extractedText) {
              try {
                const parsed = JSON.parse(item.extractedText);
                extractedTextPlain = parsed.urdu_text || item.extractedText;
              } catch (e) {
                extractedTextPlain = item.extractedText;
              }
            }
            return {
              name: item.fileName,
              imageSrc: item.imageSrc,
              extractedText: extractedTextPlain,
              rawExtractedText: item.extractedText
            };
          });
          if (this.files.length > 0) {
            this.selectedFileIndex = 0;
          }
        } else {
          this.errorMessage = 'No results found for this batch.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load OCR results.';
        console.error(err);
      }
    });
  }

  selectFile(index: number): void {
    if (index >= 0 && index < this.files.length) {
      this.selectedFileIndex = index;
      this.animateTextChange();
    }
  }

  animateTextChange(): void {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.classList.add('animate-pulse-once');
      setTimeout(() => textarea.classList.remove('animate-pulse-once'), 300);
    }
  }

  getFileItemClasses(index: number): string {
    const baseClasses = 'flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200';
    const isSelected = this.selectedFileIndex === index;
    if (isSelected) {
      return `${baseClasses} bg-cyan-500/20 dark:bg-cyan-500/20 border border-cyan-500 dark:border-cyan-400`;
    }
    return `${baseClasses} bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10`;
  }

  copyToClipboard(): void {
    const text = this.files[this.selectedFileIndex]?.extractedText;
    if (!text) {
      alert('No text to copy.');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed', err);
      alert('Failed to copy text.');
    });
  }

  toggleDownloadMenu(): void {
    this.showDownloadMenu = !this.showDownloadMenu;
  }

  downloadCurrentFile(): void {
    const text = this.files[this.selectedFileIndex]?.extractedText;
    if (!text) {
      alert('No text to download.');
      return;
    }

    this.isDownloading = true;

    // Create a blob with the text content
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Create filename with current date and original file name
    const fileName = this.files[this.selectedFileIndex]?.name || 'extracted-text';
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `${baseName}_ocr_${timestamp}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.isDownloading = false;
    this.showDownloadMenu = false;
    alert('File downloaded successfully!');
  }

  downloadAllFiles(): void {
    if (!this.files.length) {
      alert('No files to download.');
      return;
    }

    this.isDownloading = true;

    // Combine all extracted text with separators
    let allText = '';
    this.files.forEach((file, index) => {
      allText += `========================================\n`;
      allText += `File: ${file.name}\n`;
      allText += `========================================\n\n`;
      allText += file.extractedText || '(No text extracted)\n';
      allText += '\n\n';
    });

    const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `all_ocr_results_${timestamp}.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.isDownloading = false;
    this.showDownloadMenu = false;
    alert('All files downloaded successfully!');
  }

  logout(): void {
    this.authService.logout();
  }
}
