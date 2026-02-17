import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  template: `
    <div class="rounded-xl shadow-sm overflow-hidden bg-white animate-pulse">
      <!-- Image placeholder -->
      <div class="w-full aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200"></div>

      <!-- Body placeholder -->
      <div class="p-5 space-y-3">
        <!-- Title -->
        <div class="h-5 bg-stone-100 rounded-lg w-3/4"></div>

        <!-- Location -->
        <div class="h-4 bg-stone-100 rounded-lg w-1/2"></div>

        <!-- Footer row -->
        <div class="flex items-center justify-between border-t border-stone-100 pt-4 mt-4">
          <div class="h-3 bg-stone-100 rounded-lg w-2/5"></div>
          <div class="h-3 bg-stone-100 rounded-lg w-14"></div>
        </div>
      </div>
    </div>
  `,
})
export class SkeletonCard {}
