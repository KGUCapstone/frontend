import React, { useState, useEffect } from "react";
import "../style/ShoppingCalendar.css";
import api from "../api";

const ShoppingCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [calendarData, setCalendarData] = useState({});
    const [monthlySummary, setMonthlySummary] = useState({ totalSavings: 0, activeDays: 0 });

    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    useEffect(() => {
        fetchCalendarData();
    }, [currentMonth, currentYear]);

    const fetchCalendarData = async () => {
        try {
            const response = await api.post('/mainpage/calendar');
            setCalendarData(response.data);
            console.log("Calendar Data:", response.data);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
        }
    };

    useEffect(() => {
        calculateMonthlySummary();
    }, [calendarData]);

    const calculateMonthlySummary = () => {
        let totalSavings = 0;
        let activeDays = 0;

        Object.keys(calendarData).forEach(dateStr => {
            const date = new Date(dateStr);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                totalSavings += calendarData[dateStr];
                activeDays++;
            }
        });

        setMonthlySummary({ totalSavings, activeDays });
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const navigateMonth = (step) => {
        let newMonth = currentMonth + step;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
        const days = [];

        const weekdayHeader = weekdays.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
        ));

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const hasSavings = calendarData[dateStr];

            days.push(
                <div key={`day-${i}`} className={`calendar-day ${hasSavings ? 'has-activity' : ''}`}>
                    <span className="day-number">{i}</span>
                    {hasSavings && (
                        <div className="savings-indicator">
                            <span className="savings-amount">-{hasSavings.toLocaleString()}원</span>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                <div className="calendar-header">
                    <button className="month-nav-btn" onClick={() => navigateMonth(-1)}>＜</button>
                    <h3>{currentYear}년 {months[currentMonth]}</h3>
                    <button className="month-nav-btn" onClick={() => navigateMonth(1)}>＞</button>
                </div>
                <div className="calendar-grid">
                    <div className="calendar-weekdays">
                        {weekdayHeader}
                    </div>
                    <div className="calendar-days">
                        {days}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="shopping-calendar-container">
            <div className="calendar-title">
                <h2>쇼핑 캘린더</h2>
                <div className="calendar-legend">
                    <span className="legend-item">
                        <span className="dot active"></span> 절약 활동일
                    </span>
                </div>
            </div>

            <div className="calendar-wrapper">
                {renderCalendar()}
            </div>

            <div className="calendar-summary">
                <div className="summary-item">
                    <span className="summary-label">이번 달 절약 금액</span>
                    <span className="summary-value highlight">
                        {monthlySummary.totalSavings.toLocaleString()}원
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">활동 일수</span>
                    <span className="summary-value">{monthlySummary.activeDays}일</span>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCalendar;
