const chapters = [
  ['Talk', 'i'],
  ['Write', 'ii'],
  ['Build', 'iii'],
  ['Keep', 'iv'],
] as const;

export function Contents() {
  return (
    <div className="engagement-contents">
      <p className="engagement-kicker">Contents</p>
      <ol className="engagement-list">
        {chapters.map(([title, num], index) => (
          <li
            className="engagement-item"
            key={title}
            style={{ ['--i' as string]: index }}
          >
            <span className="engagement-title">{title}</span>
            <span className="engagement-leaders" aria-hidden="true" />
            <span className="engagement-num">{num}</span>
          </li>
        ))}
      </ol>
      <p className="engagement-note">In that order. You approve first.</p>
    </div>
  );
}
