import React, { useState, useEffect } from "react";
import styles from "../Calendario/Calendario.module.css";
import { ArrowLeft, ArrowRight } from "phosphor-react";

const funcionarios = [
    { id: 1, nome: "Márcio" },
    { id: 2, nome: "Derick" }
];

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

const Calendar = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek(weekOffset));
    const [selectedPeriod, setSelectedPeriod] = useState("Manhã");
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedFuncionario, setSelectedFuncionario] = useState(funcionarios[0].id);

    const fetchAvailableTimes = async () => {
        try {
            const inicio = `${selectedDay.date}T00:00:00`;
            const fim = `${selectedDay.date}T23:59:59`;

            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser ? parsedUser.token : null;
            const idClient = parsedUser ? parsedUser.id : null;

            if (!token || !idClient) {
                console.error("Token ou idClient não encontrados no objeto 'user'.");
                return;
            }

            const response = await fetch(`http://localhost:8081/agendamentos/agendamento-vagos?inicio=${inicio}&fim=${fim}&idFunc=${selectedFuncionario}&idClient=${idClient}`, {
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

    useEffect(() => {
        setDaysOfWeek(getDaysOfWeek(weekOffset));
        setSelectedDay(getDaysOfWeek(weekOffset)[0]);
    }, [weekOffset]);

    useEffect(() => {
        if (selectedDay) {
            fetchAvailableTimes();
        }
    }, [selectedDay, selectedFuncionario]);

    const filterTimesByPeriod = (times) => {
        const startMorning = 9;
        const startAfternoon = 13;
        const startNight = 17;
        const endNight = 20.5;

        return times.filter(time => {
            const [hour, minute] = time.split(":").map(num => parseInt(num, 10));
            const timeInHours = hour + minute / 60;

            if (selectedPeriod === "Manhã" && timeInHours >= startMorning && timeInHours < startAfternoon) {
                return true;
            }
            if (selectedPeriod === "Tarde" && timeInHours >= startAfternoon && timeInHours < startNight) {
                return true;
            }
            if (selectedPeriod === "Noite" && timeInHours >= startNight && timeInHours <= endNight) {
                return true;
            }
            return false;
        });
    };

    const displayTimes = availableTimes.length > 0 ? filterTimesByPeriod(availableTimes) : [];

    const handleAdvanceWeek = () => setWeekOffset(prevOffset => prevOffset + 1);

    const handleReturnWeek = () => {
        if (weekOffset > 0) setWeekOffset(prevOffset => prevOffset - 1);
    };

    const handleTimeSelect = (time) => setSelectedTime(time);

    const handlePostRequest = async () => {
        if (!selectedTime) {
            alert("Por favor, selecione um horário!");
            return;
        }
        const user = sessionStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        const token = parsedUser ? parsedUser.token : null;
        const idClient = parsedUser ? parsedUser.id : null;

        const service = sessionStorage.getItem('CORTE');
        const serviceItem = service ? JSON.parse(service) : null;

        // Criar objeto Date a partir da data e horário selecionados
        const selectedDateTime = new Date(`${selectedDay.date}T${selectedTime}:00`);

        // Verificar se a data e hora selecionadas são futuras
        const currentDateTime = new Date();
        if (selectedDateTime <= currentDateTime) {
            alert("Por favor, escolha uma data futura!");
            return; // Não enviar o POST caso a data não seja futura
        }

        // Ajustar a data para o fuso horário
        const adjustedDateTime = new Date(selectedDateTime.getTime() - (selectedDateTime.getTimezoneOffset() * 60000)).toISOString();

        // Preparar os dados para o POST
        const postData = {
            idClient,
            idFunc: selectedFuncionario,
            dataHoraInicio: adjustedDateTime,
            itens: serviceItem ? [serviceItem.nome] : []
        };

        try {
            const response = await fetch("http://localhost:8081/agendamentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                await response.json();
                alert("Agendamento realizado com sucesso!");
                fetchAvailableTimes();
            } else {
                const errorDetails = await response.text();
                console.error("Erro ao agendar:", errorDetails);
                alert("Erro ao agendar, tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao realizar o POST:", error);
            alert("Erro ao realizar o agendamento.");
        }

    };

    return (
        <section className={styles.calendarContainer}>
            <h2>Calendário</h2>
            <div className={styles.containerButton}>
                <button onClick={handleReturnWeek} className={styles.buttonWeek}> <ArrowLeft size={22} /> voltar</button>
                <strong>Escolha uma data e período</strong>
                <button onClick={handleAdvanceWeek} className={styles.buttonWeek}>avançar <ArrowRight size={22} /> </button>
            </div>

            <div className={styles.calendarHeader}>
                <div className={styles.daysButtons}>
                    {daysOfWeek.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(day)}
                            className={selectedDay.date === day.date ? styles.selected : ""}
                        >
                            {day.dayName} ({day.dayDate})
                        </button>
                    ))}
                </div>
                <div className={styles.funcionarioSelect}>
                    {funcionarios.map(func => (
                        <button
                            key={func.id}
                            onClick={() => setSelectedFuncionario(func.id)}
                            className={selectedFuncionario === func.id ? styles.selected : ""}
                        >
                            {func.nome}
                        </button>
                    ))}
                </div>

                <div className={styles.periodButtons}>
                    <button
                        onClick={() => setSelectedPeriod("Manhã")}
                        className={selectedPeriod === "Manhã" ? styles.selected : ""}
                    >
                        Manhã
                    </button>
                    <button
                        onClick={() => setSelectedPeriod("Tarde")}
                        className={selectedPeriod === "Tarde" ? styles.selected : ""}
                    >
                        Tarde
                    </button>
                    <button
                        onClick={() => setSelectedPeriod("Noite")}
                        className={selectedPeriod === "Noite" ? styles.selected : ""}
                    >
                        Noite
                    </button>
                </div>
            </div>

            <div className={styles.timesList}>
                {displayTimes.length > 0 ? (
                    displayTimes.map((time, index) => (
                        <button
                            key={index}
                            onClick={() => handleTimeSelect(time)}
                            className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ""}`}
                        >
                            {time}
                        </button>
                    ))
                ) : (
                    <p>Nenhum horário disponível para o período selecionado.</p>
                )}
            </div>
            <div className={styles.confirmButton}>
                <button onClick={handlePostRequest}>Confirmar Agendamento</button>
            </div>
        </section>
    );
};

export default Calendar;
