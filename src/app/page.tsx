import styles from "./page.module.css";
import React from "react";
import {Home} from "@/app/Home";

export default function page() {
  
  return (
    <main className={styles.main}>
      <Home/>
    </main>
  );
}
