import React, { useEffect, useState } from 'react'
import styles from './WinerySelector.module.css'; // Importa el archivo de módulos CSS
import axios from 'axios';
import { axiosClient } from '../../config/axiosClient';
import ProductWinerySelector from '../../ProductWinerySelector/ProductWinerySelector';
import { getComingSoonWineriesList } from '../../utils/getComingSoonWineries';
import ProductComingSoonWinerySelector from '../ProductComingSoonWinerySelector/ProductComingSoonWinerySelector';

const WinerySelector = () => {
    const [wineries, setWineries] = useState([]);
    const [comingSoonWineies, setComingSoonWineies] = useState([]);

    const getWineries = async () => {
        const wineries = await axiosClient.get('/wineries')
        setWineries(wineries.data)

        //coming soon wineries
        const comingSoonWineries = getComingSoonWineriesList();
        console.log(comingSoonWineries);

        setComingSoonWineies(comingSoonWineries);
        return
    }

    useEffect(() => {
        getWineries();
    }, [])

    return (
        <div className={styles['winery-selector']}>
            <nav className={`navbar navbar-expand-lg navbar-light ${styles['winery-selector-navbar']}`}>
                <div className="d-flex justify-content-between w-100">
                    <div>
                        <a className="navbar-brand" > <img src="/images/openvino-logo.png" alt="Openvino"
                            style={{ width: 200 }} /></a>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse w-full justify-content-end" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-item nav-link" href="https://openvino.atlassian.net/wiki/spaces/OPENVINO/overview?mode=global"
                            target="blank">Wiki</a>
                        <a className="nav-item nav-link" href="https://openvino.org/es/"
                            target="blank">Contact</a>
                    </div>
                </div>
            </nav>

            <div className='container'>
                <div className={styles['winery-selector-content']}>
                    <div className="d-sm-flex align-items-center justify-content-between py-2 py-sm-3">
                        <div className={`pb-2 ${styles['selector-content-header']}`}>
                            <h1>Bodegas</h1>
                        </div>
                        <div className={`input-group rounded pb-2 ${styles['input-group']}`}>
                            <input type="text" className={`rounded form-control search-input ${styles['form-control']}`}
                                placeholder="Busca aquí tu bodega" name="searchTerm" />
                        </div>
                    </div>
                    <div className={`${styles['card-group']} card-group`}>
                        {wineries.map(winery => (
                            <ProductWinerySelector key={winery.id} winery={winery} />
                        ))}
                        {comingSoonWineies.map(winery => (
                            <ProductComingSoonWinerySelector key={winery.ID} winery={winery} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WinerySelector