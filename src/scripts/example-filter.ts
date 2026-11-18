// Example filters: trade and language chips narrow the example grid. Without JS the HTML ships
// every card visible and the chips inert, so nothing is ever hidden by default.
const ALL = 'all';

export function initExampleFilter(root: Document = document): () => void {
  const tradeBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-trade]')];
  const langBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-lang]')];
  const cards = [...root.querySelectorAll<HTMLElement>('.example-grid > [data-trade]')];
  if (!cards.length) return () => {};

  let trade = ALL;
  let lang = ALL;

  const press = (btns: HTMLButtonElement[], attr: string, value: string) => {
    for (const b of btns) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
  };

  const apply = () => {
    for (const card of cards) {
      const okTrade = trade === ALL || card.dataset.trade === trade;
      const langs = (card.dataset.langs ?? '').split(/\s+/).filter(Boolean);
      const okLang = lang === ALL || langs.includes(lang);
      card.hidden = !(okTrade && okLang);
    }
  };

  const onTrade = (e: Event) => {
    trade = (e.currentTarget as HTMLElement).getAttribute('data-filter-trade') ?? ALL;
    press(tradeBtns, 'data-filter-trade', trade);
    apply();
  };
  const onLang = (e: Event) => {
    lang = (e.currentTarget as HTMLElement).getAttribute('data-filter-lang') ?? ALL;
    press(langBtns, 'data-filter-lang', lang);
    apply();
  };

  for (const b of tradeBtns) b.addEventListener('click', onTrade);
  for (const b of langBtns) b.addEventListener('click', onLang);
  return () => {
    for (const b of tradeBtns) b.removeEventListener('click', onTrade);
    for (const b of langBtns) b.removeEventListener('click', onLang);
  };
}
