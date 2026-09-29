const offerings = [
  {
    id: 'websites',
    name: 'Websites',
    audience: 'For businesses that need a clear home online.',
    includes: ['Marketing site', 'Booking', 'Blog', 'Contact forms'],
  },
  {
    id: 'saas',
    name: 'SaaS products',
    audience: 'For founders turning an idea into a product.',
    includes: ['Accounts', 'Billing', 'Dashboard', 'Admin'],
  },
  {
    id: 'web-apps',
    name: 'Custom web apps',
    audience: 'For teams replacing spreadsheets and email threads.',
    includes: ['Internal tools', 'Client portals', 'Workflows'],
  },
] as const;

export function Offerings() {
  return (
    <section id="services" className="w-full scroll-mt-24 px-4 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-3 py-1 font-medium text-muted-foreground text-xs">
          {'What I build'}
        </span>
        <h2 className="mt-5 text-balance font-serif text-4xl text-foreground leading-[1.05] sm:text-5xl">
          {'Three kinds of projects.'}
        </h2>
        <p className="mt-5 max-w-sm text-pretty text-muted-foreground leading-7">
          {'Each one designed and built by me, from the first call to launch.'}
        </p>
        {/* reference.css ships an unlayered reset, so spacing utilities it lacks need `!` to apply. */}
        <ul className="mt-12 border-border border-t">
          {offerings.map(({ id, name, audience, includes }) => (
            <li
              key={id}
              id={id}
              className="grid scroll-mt-24 gap-4 border-border border-b py-8! lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12"
            >
              <h3 className="font-serif text-3xl text-foreground leading-tight sm:text-4xl">
                {name}
              </h3>
              <div className="lg:pt-2!">
                <p className="text-pretty text-foreground leading-7">
                  {audience}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border/60 px-2.5 py-1 font-mono text-muted-foreground text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
