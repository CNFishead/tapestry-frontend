import styles from './BooksSection.module.scss';

const books = [
  {
    title: 'Core Book',
    meta: 'Primary shelf slot',
    body: 'Placeholder space for the flagship book card, cover art, or CTA once storefront content is ready.',
  },
  {
    title: 'Guide Book',
    meta: 'Companion shelf slot',
    body: 'Placeholder space for a supporting rules or setting release without needing to rebuild the page layout later.',
  },
  {
    title: 'Playtest Packet',
    meta: 'Limited release slot',
    body: 'Placeholder space for preview material, handouts, or time-boxed releases that deserve visual weight on the homepage.',
  },
];

export function BooksSection() {
  return (
    <section id="books" className={styles.section} aria-labelledby="books-title">
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <p className={styles.kicker}>Get the books</p>
          <h2 id="books-title">A storefront-ready shelf without locking the design today.</h2>
          <p className={styles.description}>This block reserves visual space for future releases, merchandising, or featured books while staying honest about today’s placeholder state.</p>
        </div>

        <aside className={styles.note}>
          <p className={styles.noteLabel}>Structure only</p>
          <p className={styles.noteCopy}>The cards below are layout placeholders, so commerce and fulfillment can attach later without a homepage rewrite.</p>
        </aside>
      </div>

      <div className={styles.shelf}>
        {books.map((book) => (
          <article key={book.title} className={styles.bookCard}>
            <div className={styles.cover} aria-hidden="true">
              <span className={styles.coverSpine} />
              <span className={styles.coverSigil}>{book.title.charAt(0)}</span>
            </div>
            <p className={styles.bookMeta}>{book.meta}</p>
            <h3>{book.title}</h3>
            <p>{book.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}