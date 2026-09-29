import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Menu,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { normalizeDomain, sampleDataProvider, type Backlink } from '@/lib/data-provider';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

function Brand() {
  return (
    <Link href="/" className="brand" data-testid="link-brand">
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">LinkLedger</span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={`header-nav ${menuOpen ? 'mobile-open' : ''}`} aria-label="Primary navigation" style={menuOpen ? { display: 'flex' } : undefined}>
          <Link href="/#plans" className="header-link" data-testid="link-plans">Plans</Link>
          <Link href="/results?domain=example.com" className="header-link" data-testid="link-sample">Sample scan</Link>
          <span className="header-status"><span className="status-dot" />Phase 1 workspace</span>
        </nav>
        <button
          type="button"
          className="mobile-menu"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function PlanCard({ name, kicker, detail, featured, onSelect }: { name: string; kicker: string; detail: string; featured?: boolean; onSelect: () => void }) {
  return (
    <article className={`plan-card ${featured ? 'featured' : ''}`} data-testid={`card-plan-${name.toLowerCase()}`}>
      <span className="plan-kicker">{kicker}</span>
      <h3 className="plan-name">{name}</h3>
      <p className="plan-detail">{detail}</p>
      <div className="plan-price">Coming soon <small>— early access pricing</small></div>
      <button type="button" className="plan-button" onClick={onSelect} data-testid={`button-plan-${name.toLowerCase()}`}>
        {featured ? 'Keep me posted' : 'View plan'} <ArrowRight size={14} />
      </button>
    </article>
  );
}

function Home() {
  const [, setLocation] = useLocation();
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [planMessage, setPlanMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeDomain(domain);
    if (!normalized) {
      setError('Enter a domain such as studio.example or a full URL.');
      return;
    }
    setError('');
    setLocation(`/results?domain=${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="app-shell texture">
      <Header />
      <main className="home-main">
        <section className="hero-grid">
          <div className="animate-rise">
            <div className="eyebrow">A calmer way to read the web</div>
            <h1 className="hero-title font-display">The <em>ledger</em><br />for your links.</h1>
            <p className="hero-copy">
              LinkLedger turns the scattered trail of pages linking to your site into a focused record of useful signals — source, context, and what deserves your attention next.
            </p>
            <form className="domain-form" onSubmit={handleSubmit} aria-label="Start a sample backlink scan">
              <div className="domain-input-wrap">
                <Globe2 size={17} aria-hidden="true" />
                <label htmlFor="domain-entry" className="sr-only">Website domain or URL</label>
                <input
                  id="domain-entry"
                  className="domain-input"
                  type="text"
                  placeholder="yourdomain.com"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  autoComplete="url"
                  data-testid="input-domain"
                />
              </div>
              <button type="submit" className="primary-button" data-testid="button-scan-domain">
                Check Backlinks <ArrowRight size={16} />
              </button>
            </form>
            {error ? <div className="error-note" role="alert" data-testid="status-domain-error">{error}</div> : null}
            <div className="form-note">No account. No crawl. Clearly labeled sample data.</div>
          </div>
          <div className="orbit-card animate-rise delay-2" aria-label="Illustration of a backlink network">
            <div className="orbit-header">
              <span className="orbit-label">Signal map / 001</span>
              <span className="orbit-number">LL–PHASE–01</span>
            </div>
            <div className="orbit-core">
              <strong>47</strong>
              <span>useful links</span>
            </div>
            <div className="orbit-node node-one">editorial</div>
            <div className="orbit-node node-two">referral</div>
            <div className="orbit-node node-three">directory</div>
            <div className="orbit-footer">
              <span>following the signal</span>
              <strong>quietly precise</strong>
            </div>
          </div>
        </section>

        <section className="section-rule animate-rise delay-3" id="plans">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Choose your vantage point</div>
              <h2 className="font-display">Start small. See clearly.</h2>
            </div>
            <p>Every plan is designed around signal, not vanity metrics. Pricing is coming soon.</p>
          </div>
          <div className="plans-grid">
            <PlanCard name="Free" kicker="For one site" detail="Ads · 2 checks/day · top 10 links" onSelect={() => setPlanMessage('Free is ready for your first sample scan.')} />
            <PlanCard name="Starter" kicker="For independent owners" detail="Ad-free · more checks · exports" featured onSelect={() => setPlanMessage('Starter updates will be shared when the workspace opens.')} />
            <PlanCard name="Agency" kicker="For small teams" detail="Multiple domains · scheduled reports" onSelect={() => setPlanMessage('Agency updates will be shared when the workspace opens.')} />
          </div>
          {planMessage ? <div className="form-note" role="status" data-testid="status-plan-message">{planMessage}</div> : null}
        </section>

      </main>
    </div>
  );
}

function Metric({ label, value, note, testId }: { label: string; value: string; note: string; testId: string }) {
  return (
    <div className="metric-card" data-testid={testId}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <p className={note.startsWith('+') ? 'delta' : ''}>{note}</p>
    </div>
  );
}

function LinkRow({ link, index }: { link: Backlink; index: number }) {
  const initials = link.source.split(' ').map((word) => word[0]).join('').slice(0, 2);
  return (
    <tr data-testid={`row-backlink-${index}`}>
      <td>
        <div className="source-cell">
          <div className="site-favicon" aria-hidden="true">{initials}</div>
          <div><div className="source-name">{link.source}</div><div className="source-url">{link.sourceUrl}</div></div>
        </div>
      </td>
      <td><span className="table-url">{link.targetUrl}</span></td>
      <td><span className="anchor-text">{link.anchorText}</span></td>
      <td><span className={`type-pill ${link.follow ? '' : 'nofollow'}`}>{link.linkType} · {link.follow ? 'Follow' : 'Nofollow'}</span></td>
      <td className="font-mono-ledger">{link.lastSeen}</td>
    </tr>
  );
}

function Results() {
  const [location, setLocation] = useLocation();
  const [filter, setFilter] = useState<'All' | 'Follow' | 'Nofollow'>('All');
  const [planMessage, setPlanMessage] = useState('');
  const domain = useMemo(() => {
    const query = location.includes('?') ? location.split('?')[1] : '';
    return normalizeDomain(new URLSearchParams(query).get('domain') ?? '') || 'example.com';
  }, [location]);
  const scan = useMemo(() => sampleDataProvider.getScan(domain), [domain]);
  const filteredLinks = scan.links.filter((link) => filter === 'All' || (filter === 'Follow' ? link.follow : !link.follow));

  return (
    <div className="app-shell texture">
      <Header />
      <main className="results-main">
        <div className="results-top animate-rise">
          <div>
            <div className="eyebrow">Sample scan / local provider</div>
            <h1 className="font-display">A clearer read on<br /><em>{scan.domain}</em></h1>
            <div className="results-domain"><Globe2 size={14} /> normalized domain · no live crawl performed</div>
          </div>
          <div className="sample-badge" data-testid="status-sample-data">SAMPLE DATA · NOT A LIVE SCAN</div>
        </div>

        <section className="metrics-grid" aria-label="Sample scan summary">
           <Metric label="Total backlinks" value={String(scan.backlinks)} note="illustrative total" testId="metric-backlinks" />
          <Metric label="Referring domains" value={String(scan.referringDomains)} note="+8.4% vs. last sample" testId="metric-domains" />
           <Metric label="Follow links" value={String(scan.followCount)} note="sample records" testId="metric-follow" />
           <Metric label="Nofollow links" value={String(scan.nofollowCount)} note="sample records" testId="metric-nofollow" />
        </section>

        <div className="results-layout">
          <section className="table-panel animate-rise delay-1" aria-labelledby="backlink-table-heading">
            <div className="panel-head">
               <div><h2 id="backlink-table-heading">Referring pages</h2><p>Seven representative records from the local sample provider.</p></div>
              <div className="filter-row" role="group" aria-label="Filter backlinks">
                {(['All', 'Follow', 'Nofollow'] as const).map((option) => (
                  <button key={option} type="button" className={`filter-chip ${filter === option ? 'active' : ''}`} onClick={() => setFilter(option)} data-testid={`button-filter-${option.toLowerCase()}`}>{option}</button>
                ))}
              </div>
            </div>
            <div className="table-scroll">
               <table className="link-table">
                <thead><tr><th>Source URL</th><th>Target URL</th><th>Anchor text</th><th>Link type</th><th>Last seen</th></tr></thead>
                <tbody>{filteredLinks.map((link, index) => <LinkRow key={link.id} link={link} index={index} />)}</tbody>
              </table>
              {filteredLinks.length === 0 ? <div className="results-footer-note" data-testid="status-empty-filter">No sample links match this filter.</div> : null}
            </div>
          </section>

          <aside className="side-stack">
            <section className="side-panel animate-rise delay-2">
              <h3>Read the signal</h3>
              <div className="signal-list">
                <div className="signal"><span>Editorial links</span><strong>43%</strong></div>
                <div className="signal"><span>Follow share</span><strong>71%</strong></div>
                <div className="signal"><span>New this month</span><strong>+06</strong></div>
              </div>
            </section>
            <section className="side-panel side-cta animate-rise delay-3">
              <h3>Want your own ledger?</h3>
              <p>Phase 1 uses a local sample provider. Live crawling is intentionally not part of this preview.</p>
              <button type="button" className="plan-button" onClick={() => setPlanMessage('You are on the early access list for the next workspace layer.')} data-testid="button-early-access">Keep me posted <ArrowRight size={14} /></button>
              {planMessage ? <div className="form-note" role="status" data-testid="status-results-message">{planMessage}</div> : null}
            </section>
            <div className="ad-placeholder" data-testid="ad-placeholder-results">
              <BarChart3 size={17} aria-hidden="true" />
              <div><strong>Free tier placement</strong><span>Paid plan mockups remove this space.</span></div>
            </div>
          </aside>
        </div>
        <div className="results-footer-note">Sample records are illustrative and not evidence of live links to {scan.domain}.</div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/results" component={Results} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;