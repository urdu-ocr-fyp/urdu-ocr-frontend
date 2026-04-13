import { Component, OnInit } from '@angular/core';
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

  fetchResults(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fileService.fetchResult(this.batchId!).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('resp', response)

          this.files = response?.data?.results?.map((item: any) => {
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
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load OCR results.';
      }
    });
  }

  selectFile(index: number): void {
    if (index >= 0 && index < this.files.length) {
      this.selectedFileIndex = index;
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
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => console.error('Copy failed', err));
  }

  downloadAsTxt(): void {
  }

  logout(): void {
    this.authService.logout();
  }
}
