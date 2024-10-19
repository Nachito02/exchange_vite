import React from 'react';
import styles from './ProductComingSoonWinerySelector.module.css'; // Importa los módulos CSS

const ProductComingSoonWinerySelector = ({ winery }) => {
    return (
       <div className={styles['card-winery']}>
         <div className={` card ${styles.card} `}>
            <div className={`${styles['card-body']} card-body`}>
                <div className={`${styles.card} bg-dark text-white card`}>
                    <img
                        className={styles['card-img']}
                        src={winery.image ? winery.image : '/images/placeholder_comingsoon.jpg'}
                        alt={winery.name}
                    />
                    <div className={`${styles['card-img-overlay']} card-img-overlay`}>
                        <p>Proximamente</p>
                    </div>
                </div>
                <h5 className={styles['card-title']} style={{ color: "#141414" }}>
                    {winery.name}
                </h5>
            </div>
        </div>
       </div>
    );
};

export default ProductComingSoonWinerySelector;
