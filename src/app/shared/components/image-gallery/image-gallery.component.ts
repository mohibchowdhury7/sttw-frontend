import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
})
export class ImageGallery {
  images = input<string[]>([]);

  currentIndex = signal(0);

  hasImages = computed(() => this.images().length > 0);
  currentImage = computed(() => this.images()[this.currentIndex()]);
  totalImages = computed(() => this.images().length);

  prev(): void {
    const total = this.totalImages();
    if (total === 0) return;
    this.currentIndex.update((i) => (i - 1 + total) % total);
  }

  next(): void {
    const total = this.totalImages();
    if (total === 0) return;
    this.currentIndex.update((i) => (i + 1) % total);
  }

  selectImage(index: number): void {
    this.currentIndex.set(index);
  }
}
