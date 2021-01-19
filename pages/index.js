import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { getJouets } from '../lib/airtable'

export async function getStaticProps() {
  const allBois = await getJouets("Bois");
  console.log("bois : ", allBois);
  const allLego = await getJouets("Lego");
  console.log("lego : ", allLego);
  return {
    props: {
      bois: allBois,
      lego: allLego,
    }
  }
}

export default function Home({ bois, lego }) {
  return (
    <>
      <Head>
        <title>Toy Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to my Toy Store !</h1>
        <ul>
          {bois.results.map(produit => {
            let image = produit.images.filter(i => i.filename.indexOf(".webp") === -1);
            console.log("image : ", image);
            let image_webp = produit.images.filter(i => i.filename.indexOf(".webp") !== -1);
            console.log("image webp : ", image_webp);
            return <li key={produit.id}>
              {produit.jouet}
              <picture>
                <source srcSet={`${image_webp[0].url}`} type="image/webp" />
                {/* <source srcSet={`${image[0].url}`} type="image/jpg"/> */}
                <img src={`${image[0].url}`} type="image/jpg" alt={`${produit.jouet}`} width="190" height="190" />
              </picture>
            </li>
          })}
        </ul>
      </main>

    </>
  )
}
