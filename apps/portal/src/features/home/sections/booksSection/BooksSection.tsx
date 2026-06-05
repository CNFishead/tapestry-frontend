import { InteractiveBook } from '@tapestry/ui';
import styles from './BooksSection.module.scss';

const books = [
  {
    title: 'Players Core Book',
    meta: 'Primary shelf slot',
    description: 'Placeholder space for the flagship book card, cover art, or CTA once storefront content is ready.',
    coverSrc: 'https://res.cloudinary.com/wulfdev/image/upload/v1780602174/ChatGPT_Image_Jan_11_2026_08_39_20_PM_-_Copy_mgah5q.png',
    spineSrc: undefined,
  },
  {
    title: 'Rules and Rulings Guide',
    meta: 'Companion shelf slot',
    description: 'Placeholder space for a supporting rules or setting release without needing to rebuild the page layout later.',
    coverSrc: 'https://res.cloudinary.com/wulfdev/image/upload/v1780602173/ChatGPT_Image_Jan_11_2026_08_38_15_PM_-_Copy_js6x3i.png',
    spineSrc: undefined,
  },
  {
    title: 'Playtest Packet',
    meta: 'Limited release slot',
    description: 'Placeholder space for preview material, handouts, or time-boxed releases that deserve visual weight on the homepage.',
    coverSrc: 'https://res.cloudinary.com/wulfdev/image/upload/v1780602174/ChatGPT_Image_Jan_11_2026_08_41_40_PM_-_Copy_shborj.png',
    spineSrc: undefined,
  },
];

export function BooksSection() {
  return (
    <section id="books" className={styles.section} aria-labelledby="books-title">
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <p className={styles.kicker}>Get the books</p>
          <h2 id="books-title">A storefront-ready shelf without locking the design today.</h2>
          <p className={styles.description}>
            This block reserves visual space for future releases, merchandising, or featured books while staying honest about today’s placeholder state.
          </p>
        </div>

        <aside className={styles.note}>
          <p className={styles.noteLabel}>Structure only</p>
          <p className={styles.noteCopy}>The cards below are layout placeholders, so commerce and fulfillment can attach later without a homepage rewrite.</p>
        </aside>
      </div>

      <div className={styles.shelf} aria-label="Featured books">
        {books.map((book) => (
          <InteractiveBook
            key={book.title}
            title={book.title}
            eyebrow={book.meta}
            description={book.description}
            coverSrc={book.coverSrc}
            spineSrc={book.spineSrc}
            width="15.5rem"
            height="20.5rem"
            spineWidth="3.15rem"
          />
        ))}
      </div>
    </section>
  );
}
