import Head from 'next/head';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

import { Workbox } from 'workbox-window';

import { getJouets } from '../lib/airtable'

export async function getStaticProps() {
  const allBois = await getJouets("Bois");
  return {
    props: {
      bois: allBois,
    }
  }
}

const order = async (e) => {
  e.preventDefault();
  const article = e.target.dataset;
  let res = await fetch('/api/order', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            ...article,
          }
        }
      ]
    })
  })
  .then(res => res.json())

  console.log("add to cart : ", res);
}

export default function Home({ bois }) {
  useEffect( async () => {
    if ( 'serviceWorker' in navigator ) {
      console.log('Global : ', global);
      const wb = new Workbox('sw.js', { scope : '/' });
      wb.register();
    }

    navigator.serviceWorker.onmessage = (event) => {
      console.log('index.js receives message from service worker : ', event)
      switch (event.data.type) {
        case 'sw_activated':
          navigator.serviceWorker.controller.postMessage( {
            type: 'ping'
          });
          break;
        case 'sw_pinged':
          console.log('service worker has been correctly pinged and return this message : ', event.data.message);
          break;
        default: 
          console.log('message from service worker : ', event);
      }

    } 
  })

  return (
    <>
      <Head>
        <title>Toy Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>Welcome to my Toy Store !</h1>
        </header>
        
        <ul>
          {bois.results.map(produit => {
            let image = produit.images.filter(i => i.filename.indexOf(".webp") === -1);
            let image_webp = produit.images.filter(i => i.filename.indexOf(".webp") !== -1);
            return <li key={produit.id}>
              <h2 className='mx-2'>{produit.jouet}</h2>
              <p className='mx-2'>{`${produit.prix} €`}</p>
              <form>
                <input className='p-2' id='quantity' type='number' min='0' defaultValue='0' step='0.01'/>
                <button id='order' className='mx-2 p-2 bg-red-600 active:bg-red-400 border-2 border-white text-white rounded-lg focus:outline-none' type='submit' data-id={produit.id} data-jouet={produit.jouet} data-code={produit.code} data-prix={produit.prix} onClick={order}>Ajouter au Panier</button>
              </form>
              <picture>
                <source srcSet={`${image_webp[0].url}`} type="image/webp" alt={`${produit.jouet}`} width="190" height="190" />
                <img src={`${image[0].url}`} type="image/jpg" alt={`${produit.jouet}`} width="190" height="190" />
              </picture>
            </li>
          })}
        </ul>
      </main>

    </>
  )
}
