import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './RoomCodeBox.module.css';

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

interface RoomCodeBoxProps {
  code: string;
  inviteLink?: string;
}

export default function RoomCodeBox({ code, inviteLink }: RoomCodeBoxProps) {
  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const link = inviteLink ?? `${window.location.origin}/join?code=${code}`;

  return (
    <Card padded={false}>
      <div className={styles.codeRow}>
        <div>
          <p className={styles.codeLabel}>Room Code</p>
          <p className={styles.codeValue}>{code}</p>
        </div>
        <Button variant="secondary" fullWidth={false} onClick={() => copy(code)}>
          <CopyIcon /> Copy Code
        </Button>
      </div>

      <div className={styles.divider} />

      <div className={styles.inviteRow}>
        <input className={styles.inviteInput} value={link} readOnly />
        <Button variant="secondary" fullWidth={false} onClick={() => copy(link)}>
          <CopyIcon /> Copy Link
        </Button>
      </div>
    </Card>
  );
}
