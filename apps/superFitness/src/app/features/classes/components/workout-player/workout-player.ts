import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube-video.utils';

@Component({
  selector: 'app-workout-player',
  standalone: true,
  imports: [],
  templateUrl: './workout-player.html',
  styleUrl: './workout-player.scss',
})
export class WorkoutPlayer {
private readonly sanitizer = inject(DomSanitizer);

readonly title = input.required<string>();
readonly exerciseId = input.required<string>();
readonly level = input<string>('');
readonly duration = input<string>('');
readonly muscleImage = input<string | null>(null);

readonly isPlaying = signal(false);

 private readonly workoutVideos = [
    'fAf6Z7wu7fM',
    '_mZe77ek9s0',
    'uN3kBHAV1ZA',
    'vwJE-6VnLfM',
    'as2oPs5mkhU',
  ];
  private lastVideoIndex = -1;

  private readonly selectedVideoId = signal<string | null>(null);

constructor() {
  effect(() => {
    this.exerciseId();

  untracked(() => {
    this.selectRandomVideo();
    this.isPlaying.set(false);
  }); 
  });
}


readonly poster = computed(() => {
  const videoId = this.selectedVideoId();

  return videoId
    ? getYouTubeThumbnailUrl(
        `https://www.youtube.com/watch?v=${videoId}`,
      )
    : '';
});
// Creates a trusted YouTube embed URL that starts playback automatically.
readonly embedUrl = computed(() => {
    const id = this.selectedVideoId();

  return id
    ? this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      )
    : null;
});

play(): void {
  if (this.selectedVideoId()) {
    this.isPlaying.set(true);
  }
}

private selectRandomVideo(): void {
  let randomIndex: number;

  do {
    randomIndex = Math.floor(Math.random() * this.workoutVideos.length);
  } while (randomIndex === this.lastVideoIndex);

  this.lastVideoIndex = randomIndex;

  this.selectedVideoId.set(this.workoutVideos[randomIndex]);
}

 
}
