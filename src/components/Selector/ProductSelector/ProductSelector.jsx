import React from 'react';
import styles from './ProductSelector.module.css';
import { useNavigate, useParams } from 'react-router-dom';
const ProductSelector = ({ product }) => {
  const { wineryId } = useParams();

  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/${wineryId}/${product.id}`);
  };
  return (
    <div className='col-6 col-sm-6 col-md-4 col-lg-3' onClick={handleProductClick}>

      <div className={`${styles['product-selector']} product-selector`}>
        <img className={styles['product-selector-img']} alt={product.id} src={product.image} />
      </div>
    </div>

  );
};

export default ProductSelector;
