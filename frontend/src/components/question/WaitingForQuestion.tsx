import styles from './WaitingForQuestion.module.css';

interface WaitingForQuestionProps {
  selectedPlayerNickname: string;
}

export default function WaitingForQuestion({ selectedPlayerNickname }: WaitingForQuestionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.label}>
        Waiting for <span className={styles.name}>{selectedPlayerNickname}</span> to create a question…
      </p>
    </div>
  );
}
