import styles from "./benchmark-scene.module.css";

const signals = [
  { label: "Activation", value: "+18%", detail: "Intent rising" },
  { label: "Retention", value: "92%", detail: "Pattern stable" },
  { label: "Next move", value: "Scale", detail: "Signal confirmed" },
];

export function BenchmarkScene() {
  return (
    <article
      className={`${styles.scene} rounded-xl p-5 ring-1 ring-border sm:p-7`}
      aria-label="信号洞察产品叙事动画"
    >
      <div
        className={`${styles.orb} -top-20 -right-16`}
        data-anim="orb"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[27rem] flex-col">
        <header className="max-w-xl">
          <div
            className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase"
            data-anim="eyebrow"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Live signal / 08:42
          </div>
          <h2
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            data-anim="title"
          >
            From scattered activity to a confident next move.
          </h2>
          <p
            className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground"
            data-anim="summary"
          >
            The same product narrative is choreographed by three runtimes. Only
            the motion engine changes.
          </p>
        </header>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {signals.map((signal) => (
            <div
              key={signal.label}
              data-anim="signal-card"
              className="rounded-lg bg-background/74 p-3.5 shadow-[var(--shadow-card)] ring-1 ring-border backdrop-blur-sm"
            >
              <p className="text-xs text-muted-foreground">{signal.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {signal.value}
              </p>
              <p className="mt-1 text-[0.68rem] text-primary">
                {signal.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="relative min-h-32 overflow-hidden rounded-lg bg-muted/40 p-3 ring-1 ring-border">
            <div className="flex justify-between font-mono text-[0.62rem] tracking-wider text-muted-foreground uppercase">
              <span>Signal confidence</span>
              <span>Last 24h</span>
            </div>
            <svg
              className="mt-2 h-24 w-full overflow-visible"
              viewBox="0 0 520 110"
              role="img"
              aria-label="持续上升的信号置信度"
            >
              <defs>
                <linearGradient id="signal-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0"
                    stopColor="var(--primary)"
                    stopOpacity="0.22"
                  />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 96 C48 92 67 72 108 78 C151 84 168 54 216 61 C257 67 286 29 330 42 C374 55 401 23 440 27 C474 30 496 13 520 8 L520 110 L0 110 Z"
                fill="url(#signal-fill)"
                aria-hidden
              />
              <path
                d="M0 96 C48 92 67 72 108 78 C151 84 168 54 216 61 C257 67 286 29 330 42 C374 55 401 23 440 27 C474 30 496 13 520 8"
                fill="none"
                pathLength="1"
                stroke="var(--primary)"
                strokeLinecap="round"
                strokeWidth="3"
                data-anim="signal-path"
              />
              <circle
                cx="520"
                cy="8"
                r="5"
                fill="var(--primary)"
                stroke="var(--background)"
                strokeWidth="3"
                data-anim="signal-dot"
              />
            </svg>
          </div>

          <div
            className="flex flex-col justify-between rounded-lg bg-primary p-4 text-primary-foreground shadow-[var(--shadow-card)]"
            data-anim="decision"
          >
            <span
              className="icon-[solar--bolt-circle-bold-duotone] size-6"
              aria-hidden
            />
            <div>
              <p className="font-mono text-[0.62rem] tracking-wider uppercase opacity-70">
                Decision ready
              </p>
              <p className="mt-1 text-lg font-semibold leading-tight">
                Scale the guided path.
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="叙事阶段">
          {[
            ["01", "Collect"],
            ["02", "Resolve"],
            ["03", "Decide"],
          ].map(([number, label]) => (
            <li
              key={number}
              className="flex items-center gap-2 text-xs text-muted-foreground"
              data-anim="phase"
            >
              <span className="font-mono text-primary">{number}</span>
              <span className="h-px flex-1 bg-border" />
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export { styles as benchmarkSceneStyles };
