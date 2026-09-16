# LineOne theme audit

## Source

The authoritative source is `D:\techoma\theme\limeone\lineone-html`, primarily `src/html`, `src/css`, `src/images`, `src/fonts`, and `package.json`. Starter pages define the shell; table, form, modal, badge, card, and pagination examples define component presentation.

## Extracted tokens

- Typography: Poppins for application text; Inter for badges, pagination, and numeric/table utility text.
- Primary: `#4f46e5`; focus: `#4338ca`; accent: `#5f5af6`; accent light: `#818cf8`.
- Semantic: success `#10b981`, warning `#ff9800`, error `#ff5724`, info `#0ea5e9`.
- Light canvas: slate-50; surfaces: white; primary text: slate-800; body text: slate-500; border: slate-150/slate-200.
- Dark canvas: navy-900; surfaces: navy-700/navy-750; borders: navy-500/navy-600.
- Cards and controls use `rounded-lg`. Card shadow is `0 3px 10px rgb(48 46 56 / 6%)`.
- Controls use `px-3 py-2`; standard buttons use `px-5 py-2`.
- Header height: 61px. Sidebar rail: 4.5rem, 5rem from `lg`. Panel: 230px, 240px from `lg`.
- Horizontal page margin: 1rem, 1.5rem from `md`, and 4rem from `xl`. Page title padding is `py-5 lg:py-6`; content gaps are `gap-4 sm:gap-5 lg:gap-6`.

## Component mappings

- `.btn` -> shared `Button`
- `.form-input`, `.form-select`, `.form-textarea` -> shared `Input`, `Select`, `Textarea`, and `DatePicker`
- `.badge` -> shared `Badge`
- `.card` -> existing card primitive/classes
- LineOne modal composition -> shared `Modal` and `ConfirmationDialog`
- LineOne table borders/hover/spacing -> Recruitment `JobTable`
- LineOne pagination, skeleton, and empty-state patterns -> existing shared components

## Layout rules

The existing React dashboard retains its icon rail, slide-out navigation panel, fixed 61px header, and responsive main-content offsets. Page content uses the theme margin variable. Recruitment Jobs uses the LineOne title band, responsive content grid, cards, table borders, hover treatment, badges, and responsive horizontal scrolling.

## Assets and fonts

The existing local copies of the source Poppins and Inter TTF files are used through `@font-face`. Lucide remains the React icon implementation; no external font or asset URL and no Bootstrap dependency were introduced.

## React decisions

The existing Tailwind 4 foundation was extended rather than replaced. Shared component APIs and Recruitment business logic remain unchanged. Only Recruitment Jobs received page-specific styling in this phase.
