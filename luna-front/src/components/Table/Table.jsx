import React, { useState } from 'react';
import style from './Table.module.css';
import Filter from '../Filter/Filter';

import { ArrowLeft, ArrowRight } from "phosphor-react";

const TableHeader = ({ headers }) => {
    return (
        <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
        </thead>
    );
};

// Função para formatar data no estilo "Ter 18/03"
const formatDate = (dateString) => {
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Retorna o valor original se não for uma data válida

    const dayName = daysOfWeek[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayName} ${day}/${month}`;
};

const TableBody = ({ data }) => {
    return (
        <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={cellIndex === 2 ? style.dateCell : ''}>
                            {cellIndex === 2 ? formatDate(cell) : cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

const DynamicTable = ({
    headers,
    data,
    useFilter = false,
    usePagination = false,
    rowsPerPage = 10,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');

    const handleFilterChange = (value) => {
        setFilter(value);
        setCurrentPage(1);
    };

    const filteredData = data.filter((row) =>
        row.some(cell => cell.toString().toLowerCase().includes(filter.toLowerCase()))
    );

    const dataToDisplay = filter ? filteredData : data;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = usePagination ? dataToDisplay.slice(indexOfFirstRow, indexOfLastRow) : dataToDisplay;

    const totalPages = Math.ceil(dataToDisplay.length / rowsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={style.tableContainer}>
            {useFilter && <Filter onFilterChange={handleFilterChange} />}

            <table className={style.customTable}>
                <TableHeader headers={headers} />
                <TableBody data={currentRows} />
            </table>

            {usePagination && (
                <div className={style.pagination}>
                    <button className={style.arrow}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeft size={22} />
                        Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? style.active : ''}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button className={style.arrow}
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Próximo
                        <ArrowRight size={22} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DynamicTable;
