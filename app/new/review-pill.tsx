import { Star } from 'lucide-react';

export function ReviewPill() {
  return (
    <div className="review-pill">
      <span className="review-pill-stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} size={13} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="review-pill-copy">23 five-star client reviews</span>
    </div>
  );
}
