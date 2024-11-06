import React, { useState, useEffect } from "react";
import styles from "../Calendario/Calendario.module.css";
import { ArrowLeft, ArrowRight } from "phosphor-react";

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
            date: day.toISOString().split("T")[0],
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
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        setDaysOfWeek(getDaysOfWeek(weekOffset));
        setSelectedDay(getDaysOfWeek(weekOffset)[0]);
    }, [weekOffset]);

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            try {
                const inicio = `${selectedDay.date}T00:00:00`;
                const fim = `${selectedDay.date}T23:59:59`;

                const user = sessionStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;
                const token = parsedUser ? parsedUser.token : null;
                const idClient = parsedUser ? parsedUser.id : null;

                console.log("Token:", token);
                console.log("idClient:", idClient);

                if (!token || !idClient) {
                    console.error("Token ou idClient não encontrados no objeto 'user'.");
                    return;
                }

                const response = await fetch(`http://localhost:8081/agendamentos/agendamento-vagos?inicio=${inicio}&fim=${fim}&idClient=${idClient}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                    }
                });

                if (!response.ok) {
                    const errorDetails = await response.text(); 
                    console.error("Erro ao fazer requisição:", errorDetails);
                    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const horariosDisponiveis = await response.json();
                    setAvailableTimes(
                        horariosDisponiveis.map(horario =>
                            new Date(horario).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        )
                    );
                } else {
                    throw new Error("Resposta não é JSON, possivelmente uma página de erro HTML");
                }
            } catch (error) {
                console.error("Erro ao buscar horários disponíveis:", error);
            }
        };
        if (selectedDay) {
            fetchAvailableTimes();
        }
    }, [selectedDay]);


    const morningTimes = generateTimes(7, 45, 8);
    const afternoonTimes = generateTimes(13, 45, 8);
    const nightTimes = generateTimes(18, 45, 8);

    const times =
        selectedPeriod === "Manhã" ? morningTimes : selectedPeriod === "Tarde" ? afternoonTimes : nightTimes;

    const displayTimes = times.filter(time => availableTimes.includes(time));

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
                {displayTimes.length > 0 ? (
                    displayTimes.map((time, index) => (
                        <button key={index} className={styles.timeSlot}>
                            {time}
                        </button>
                    ))
                ) : (
                    <p>Nenhum horário disponível</p>
                )}
            </div>
        </section>
    );
};

export default Calendar;
