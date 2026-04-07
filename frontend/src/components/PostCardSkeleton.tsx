import GridContainer from './GridContainer';
import Skeleton from './Skeleton';

export default function PostCardSkeleton() {
  return (
    <GridContainer>
      <div className="post-card" style={{ pointerEvents: 'none' }}>
        {/* Left Column: Image Area Skeleton */}
        <div className="post-card-image">
          <Skeleton style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Middle Column: Title & Excerpt Skeleton */}
        <div className="post-card-content" style={{ gap: '1rem' }}>
          <Skeleton style={{ width: '70%', height: '2rem' }} /> {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton style={{ width: '100%', height: '1rem' }} /> {/* Excerpt line 1 */}
            <Skeleton style={{ width: '90%', height: '1rem' }} />  {/* Excerpt line 2 */}
            <Skeleton style={{ width: '40%', height: '1rem' }} />  {/* Excerpt line 3 */}
          </div>
        </div>

        {/* Right Column: Tags & Date Skeleton */}
        <div className="post-card-meta">
          <Skeleton style={{ width: '80px', height: '1rem' }} /> {/* Date */}
          <div className="tags-row" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            <Skeleton style={{ width: '60px', height: '1.5rem' }} /> {/* Tag 1 */}
            <Skeleton style={{ width: '75px', height: '1.5rem' }} /> {/* Tag 2 */}
          </div>
        </div>
      </div>
    </GridContainer>
  );
}
