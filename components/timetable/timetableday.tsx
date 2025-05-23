"use client";
import { UserType } from "@/db/dbreq";
import React from "react";
import { TimetableLesson } from "@/app/api/timetable/route";
import Image from "next/image";
import teacherDataByNames from "@/public/storage/teacherDataByNames.json";
import teacherName from "@/app/api/teacherName";
import { Alert } from "../home/alert";
import Link from "next/link";
import { useTimetable } from "@/hooks/useTimetable";

const TimetableDay = (props: { selfUser: UserType; hideTitle?: boolean }) => {
  const { selfUser, hideTitle } = props;
  const studentCode = selfUser.EJG_code;

  const {
    timetable,
    isLoading,
    isError,
    selectedDay,
    setSelectedDay,
    days,
    periodTimes,
    isConfigured,
  } = useTimetable({
    studentCode,
  });

  if (!isConfigured) {
    return (
      <Alert className="border-selfprimary-300 bg-selfprimary-50">
        <Link href="/me">
          Hiányos adatok. Kérjük, add meg a hiányzó adataidat a{" "}
          <strong className="text-selfprimary-700">
            profilodban, a Személyes adatok fülnél.
          </strong>
        </Link>
      </Alert>
    );
  }

  const renderLesson = (lesson: TimetableLesson, period: number) => {
    if (lesson.code === "-") {
      return null;
    }

    const getTeacherImage = (teacher: string) => {
      const teacherData =
        teacherDataByNames[
          teacherName(teacher) as keyof typeof teacherDataByNames
        ];
      return teacherData ? teacherData.Photo : null;
    };

    return (
      <div className="flex items-center justify-center gap-2">
        <div className="h-[72px] w-16 rounded-lg bg-selfprimary-100 py-3 text-center text-foreground">
          <p className="text-xl font-semibold text-selfprimary-800">{period}</p>
          <p className="text-sm text-selfprimary-800">
            {periodTimes[period as keyof typeof periodTimes].split(" - ")[0]}
          </p>
        </div>

        <div className="w-full rounded-lg bg-selfprimary-100 p-3">
          <div className="flex items-center gap-2">
            <Image
              src={getTeacherImage(lesson.teacher) ?? "/question-mark.svg"}
              alt={getTeacherImage(lesson.teacher) ?? "image"}
              width={40}
              height={40}
              className="h-12 w-12 rounded-full border border-selfprimary-200 object-cover"
              unoptimized
            />
            <div>
              <h3 className="text-lg font-semibold">{lesson.subject_name}</h3>
              <p className="text-sm">{lesson.teacher}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2">
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        {!hideTitle && (
          <h2 className="mb-3 text-2xl font-bold md:mb-0">Órarend</h2>
        )}
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedDay === day
                  ? "bg-selfprimary-600 text-white"
                  : "bg-foreground-100 text-foreground-700 hover:bg-foreground-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Hiba történt az órarend betöltése közben. Kérjük, próbáld újra később.
        </div>
      )}

      {timetable ? (
        <div className="space-y-2">
          {timetable[selectedDay] &&
            Object.entries(timetable[selectedDay]).map(
              ([period, lesson]) =>
                lesson.code !== "-" && (
                  <div className="flex-grow" key={period}>
                    {renderLesson(lesson, parseInt(period))}
                  </div>
                ),
            )}

          {timetable[selectedDay] &&
            Object.values(timetable[selectedDay]).every(
              (lesson) => lesson.code === "-",
            ) && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
                Nincs óra ezen a napon.
              </div>
            )}
        </div>
      ) : null}

      {!timetable && !isError && !isLoading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
          Nem található órarend.
        </div>
      )}
    </div>
  );
};

export default TimetableDay;
