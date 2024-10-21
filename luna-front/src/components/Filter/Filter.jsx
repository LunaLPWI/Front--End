import React from 'react';
import styles from './Filter.module.css';

const Filter = ({ onFilterChange }) => {
    return (
        <div className={styles.filterContainer}>
            <h1>FILTRO</h1>
            <input
                type="text"
                placeholder="Filtrar por nome..."
                onChange={(e) => onFilterChange(e.target.value)}
                className={styles.filterInput}
            />
        </div>
    );
};

export default Filter;
