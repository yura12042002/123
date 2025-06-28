import React from "react";
import MentorPrivew from "../components/mentorPrivew/MentorPrivew";
import NewLevel from "../components/newLevel/NewLevel";
import ReviewsBlock from "../components/reviewsBlock/ReviewsBlock";
import StudentsWork from "../components/studentsWorks/StudentsWork";
import { reviews } from "../data/reviewData";
import ExperienceSection from "../components/experienceSection/ExperienceSection";

const Mentor = () => {
  return (
    <>
      <MentorPrivew />

      {/* <NewLevel /> */}
      <StudentsWork />
      <ReviewsBlock reviews={reviews} />
      <ExperienceSection />

      {/* <SliderMainPage /> */}
    </>
  );
};

export default Mentor;

// user: Добрый день! Хочу записаться на прогулку завтра!

// bot: Отличная идея! Завра ожидается ветер 1 м/c, солнечно 24 градуса.

// user: Какие есть еще свободные даты?

// bot: На 10.06.25 есть 4 свободных места.

// Сколько будет стоить на 4 человека

// Стоимость будет зависеть от выбранного маршрута (3 маршрута) 2 часа ссылка на маршрут (1500 тысячи с человека), 4 часа

// также вы можете снять квартиру на время пребывания.
