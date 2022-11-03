import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

// styles
import styles from "./Home.module.css";

export default function Home() {
  // get user prop
  const { user } = useAuthContext();
  // connect to useCollection hook
  const { documents, error } = useCollection(
    "transactions",
    // null, // for debug of firebase rule
    ["uid", "==", user.uid], // arguments for where clause
    ["createdAt", "desc"]
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {error && <p>{error}</p>}
        {documents && <TransactionList transactions={documents} />}
      </div>
      <div className={styles.sidebar}>
        <TransactionForm uid={user.uid} />
      </div>
    </div>
  );
}
