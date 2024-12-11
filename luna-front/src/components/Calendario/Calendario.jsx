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

    // Calcular a diferença de dias até a terça-feira da semana atual
    let daysToCurrentTuesday = (2 - currentDay);
    if (daysToCurrentTuesday > 0) {
        daysToCurrentTuesday -= 7; // Se for antes de terça, pegue a terça da semana passada
    }

    let tuesday = new Date(currentDate);
    tuesday.setDate(currentDate.getDate() + daysToCurrentTuesday + (offset * 7));

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
    const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek(0));
    const [selectedPeriod, setSelectedPeriod] = useState("Manhã");
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedFuncionario, setSelectedFuncionario] = useState(funcionarios[0].id);

    const formatDateWithoutZ = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };
    

    const fetchAvailableTimes = async () => {
        try {
            const currentDay = new Date(selectedDay.date);  // Pega o dia clicado

            // Adiciona um dia à data selecionada rsrsrs
            currentDay.setDate(currentDay.getDate() + 1);

            const start = new Date(currentDay);
            start.setHours(9, 0, 0, 0);  // Inicia às 9h do dia clicado

            const end = new Date(currentDay);
            end.setHours(20, 0, 0, 0);  // Finaliza às 20h do mesmo dia

            const startDate = formatDateWithoutZ(start);
            const endDate = formatDateWithoutZ(end);

            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser ? parsedUser.token : null;
            const clientId = parsedUser ? parsedUser.id : null;

            if (!token || !clientId) {
                console.error("Token ou clientId não encontrados no objeto 'user'.");
                return;
            }

            console.log("Parâmetros enviados para a API:");
            console.log("start:", startDate);
            console.log("end:", endDate);
            console.log("employeeId:", selectedFuncionario);
            console.log("clientId:", clientId);

            const response = await fetch(`http://localhost:8080/schedules/vacant-schedules?start=${startDate}&end=${endDate}&employeeId=${selectedFuncionario}&clientId=${clientId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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
    const handleSchedulePost = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
    
            const token = parsedUser ? parsedUser.token : null;
            const clientId = parsedUser ? parsedUser.id : null;
    
            if (!token || !clientId) {
                console.error("Token ou clientId não encontrados no objeto 'user'.");
                return;
            }
    
            // Lista de nomes de tarefas esperadas
            const taskNames = [
                'CORTE', 'BARBA', 'BOTOX', 'HIDRATACAO',
                'PEZINHOCABELOBARBA', 'PEZINHO', 'PLATINADOCORTE',
                'RASPARCABECA', 'SOBRANCELHA', 'RELAXAMENTO'
            ];
    
            // Verifica quais nomes estão no sessionStorage
            const items = [];
            console.log("Verificando chaves no sessionStorage...");
            taskNames.forEach(task => {
                if (sessionStorage.getItem(task)) {
                    console.log(`Task encontrada: ${task}`);
                    items.push(task);
                }
            });
    
            // Função para adicionar 1 dia à data
            const addOneDay = (date) => {
                const adjustedDate = new Date(date);
                adjustedDate.setDate(adjustedDate.getDate()); // Adiciona 1 dia
                return adjustedDate;
            };
    
            const payload = {
                clientId: clientId,
                employeeId: selectedFuncionario,
                startDateTime: formatDateWithoutZ(
                    addOneDay(new Date(`${selectedDay.date}T${selectedTime}`))  // Adiciona 1 dia à data de agendamento
                ),
                items: items,
            };
    
            console.log("Payload being sent:", JSON.stringify(payload)); // Debug do payload final
    
            const response = await fetch('http://localhost:8080/schedules', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Erro ao fazer requisição:", errorDetails);
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
    
            console.log("Agendamento realizado com sucesso!");
            alert("Agendamento realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao realizar o agendamento:", error);
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
                <button onClick={handleSchedulePost}>Confirmar Agendamento</button>
            </div>

        </section>
    );
};

export default Calendar;
