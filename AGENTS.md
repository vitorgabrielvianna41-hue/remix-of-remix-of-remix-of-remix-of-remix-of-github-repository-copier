<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep landing-page display copy in `public/mapa.html`; `src/routes/index.tsx` adapts its assets and renders the carousel, so niche changes must also update route metadata and carousel copy without changing presentation or checkout wiring.
- Register landing-page tracking scripts once in the index route head to avoid duplicate tracking from the imported static HTML.
- Keep the no-banner advertising region gate and provider installation in `src/lib/landing-tracking.ts`; block unresolved regions and honor opt-outs before loading either tag.
- Resolve advertising geography through same-origin Cloudflare trace first, then its public CORS trace only if unavailable; omit credentials and referrers so non-Cloudflare hosts work without weakening regional blocking.
