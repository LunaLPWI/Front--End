import React, { useState, useEffect } from "react";
import styles from "../Calendario/Calendario.module.css";

import { ArrowLeft } from "phosphor-react";
import { ArrowRight } from "phosphor-react";



const getDaysOfWeek = (offset = 0) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    let tuesday = new Date(currentDate);
    tuesday.setDate(currentDate.getDate() - (currentDay - 2) + offset * 7); 

    const daysOfWeek = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(tuesday);
        day.setDate(tuesday.getDate() + i);
        daysOfWeek.push({
            dayName: day.toLocaleDateString('pt-BR', { weekday: 'long' }),
            dayDate: day.toLocaleDateString('pt-BR'),
        });
    }

    return daysOfWeek;
};

const generateTimes = (startHour, intervalMinutes, count) => {
    let times = [];
    let startTime = new Date();
    startTime.setHours(startHour, 45, 0, 0);
    for (let i = 0; i < count; i++) {
        times.push(startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        startTime = new Date(startTime.getTime() + intervalMinutes * 60000);
    }
    return times;
};

const Calendar = () => {
    const [weekOffset, setWeekOffset] = useState(0); 
    const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek(weekOffset)); 
    const [selectedPeriod, setSelectedPeriod] = useState("Manhã");
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

    useEffect(() => {
        setDaysOfWeek(getDaysOfWeek(weekOffset)); 
        setSelectedDay(daysOfWeek[0]);
    }, [weekOffset]);

    const morningTimes = generateTimes(7, 45, 8);
    const afternoonTimes = generateTimes(13, 45, 8);
    const nightTimes = generateTimes(18, 45, 8);

    const times =
        selectedPeriod === "Manhã" ? morningTimes : selectedPeriod === "Tarde" ? afternoonTimes : nightTimes;

    const handleAdvanceWeek = () => {
        setWeekOffset(prevOffset => prevOffset + 1); 
    };

    const handleReturnWeek = () => {
        if (weekOffset > 0) {
            setWeekOffset(prevOffset => prevOffset - 1); 
        }
    };

    return (
        <section className={styles.calendarContainer}>
            <h2>Calendário</h2>
            <div className={styles.containerButton}> 
                <button onClick={handleReturnWeek} className={styles.buttonWeek}> <ArrowLeft size={22} /> voltar</button>
                <strong>Escolha uma data e período</strong>
                <button onClick={handleAdvanceWeek} className={styles.buttonWeek} >avançar <ArrowRight size={22} /> </button>
            </div>
            <div className={styles.calendarHeader}>
                <div className={styles.daysButtons}>
                    {daysOfWeek.map((day, index) => (
                        <button key={index} onClick={() => setSelectedDay(day)}>
                            {day.dayName} ({day.dayDate})
                        </button>
                    ))}
                </div>
                <div className={styles.periodButtons}>
                    <button onClick={() => setSelectedPeriod("Manhã")}>Manhã</button>
                    <button onClick={() => setSelectedPeriod("Tarde")}>Tarde</button>
                    <button onClick={() => setSelectedPeriod("Noite")}>Noite</button>
                </div>
            </div>
            <div className={styles.timesList}>
                {times.map((time, index) => (
                    <button key={index} className={styles.timeSlot}>
                        {time}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Calendar;
