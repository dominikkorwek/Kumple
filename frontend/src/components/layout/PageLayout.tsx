import type { ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export default function PageLayout({ children, wide }: PageLayoutProps) {
  const maxWidth = wide ? 680 : 440;
  return (
    <div className={styles.layout}>
      <div className={styles.inner} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
