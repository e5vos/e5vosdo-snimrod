"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Input, Link, RadioGroup, Radio, InputOtp } from "@heroui/react";
import saveSettings, { SettingsProps } from "./saveSettings";
import { Alert } from "@/components/home/alert";

const PersonalDataSettings = ({ selfUser, setSaveSettings }: SettingsProps) => {
  const [nickname, setNickname] = useState<string>(selfUser.nickname);
  const [nicknameError, setNicknameError] = useState<string>("");
  const [studentCode, setStudentCode] = useState<string>(
    selfUser.EJG_code ?? "",
  );
  const [studentCodeError, setStudentCodeError] = useState<string>("");
  const [foodMenu, setFoodMenu] = useState<string>(selfUser.food_menu);
  const [code78OM, setCode78OM] = useState<string>(
    localStorage.getItem("78OM") ?? "",
  );

  useEffect(() => {
    if (code78OM.length === 2) {
      localStorage.setItem("78OM", code78OM);
    }
  }, [code78OM]);

  const isAlphabetic = (username: string): boolean =>
    /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(username);
  const isValidEJGCode = (code: string): boolean => /^[A-Z0-9]+$/.test(code);

  const handleSave = useCallback(() => {
    if (nicknameError || studentCodeError) return;
    if (
      nickname === selfUser.nickname &&
      studentCode === selfUser.EJG_code &&
      foodMenu === selfUser.food_menu
    )
      return;
    saveSettings({
      settings: {
        nickname,
        EJG_code: studentCode.length === 13 ? studentCode : "",
        food_menu: foodMenu,
      },
      reload: true,
    });
  }, [
    nickname,
    studentCode,
    foodMenu,
    nicknameError,
    studentCodeError,
    selfUser.nickname,
    selfUser.EJG_code,
    selfUser.food_menu,
  ]);

  useEffect(() => {
    setSaveSettings(() => handleSave);
  }, [handleSave, setSaveSettings]);

  return (
    <div>
      {studentCode === "" && (
        <Alert className="mt-2 border-selfsecondary-300 bg-selfsecondary-100">
          Az EJG kódod még nincs megadva. Az EJG kód nélkül nem tudod használni
          az alkalmazás számos funkcióját, például az órarended megtekintését és
          a beállításaid módosítását.
        </Alert>
      )}
      <Alert
        icon={false}
        className="mt-2 border-selfsecondary-300 bg-selfsecondary-100"
      >
        Az OM azonosító a diákigazolványodon található személyes adat.
        Adatvédelmi okokból ezt az adatot kizárólag az eszközödön tároljuk, nem
        fiókhoz kötött. Amennyiben egy mások eszközön jelentkezel be, azon újra
        meg kell adnod ezt az adatot.
      </Alert>
      <table className="table gap-y-2">
        <tbody>
          <tr>
            <th className="font-semibold">Név:</th>
            <td>{selfUser.name}</td>
          </tr>
          <tr>
            <th className="font-semibold">Felhasználónév:</th>
            <td>
              <Input
                color={nicknameError ? "danger" : "primary"}
                placeholder="Felhasználónév"
                value={nickname}
                onChange={(e) => {
                  const value = e.target.value;
                  setNickname(value.substring(0, 10));
                  if (!isAlphabetic(value)) {
                    setNicknameError(
                      "A felhasználónév csak betűket tartalmazhat.",
                    );
                  } else if (value.length < 3) {
                    setNicknameError(
                      "A felhasználónévnek legalább 3 karakter hosszúnak kell lennie.",
                    );
                  } else {
                    setNicknameError("");
                  }
                }}
                size="md"
              />
              {nicknameError && (
                <p className="text-danger-600">{nicknameError}</p>
              )}
            </td>
          </tr>
          <tr>
            <th className="font-semibold">Profilkép beállítása:</th>
            <td>
              <Link
                href="https://myaccount.google.com/personal-info?hl=hu&utm_source=OGB&utm_medium=act"
                className="text-selfprimary"
              >
                Google fiók profilképének állítása
              </Link>
              <p className="text-sm">
                (A profilkép jelenleg csak így változtatható)
              </p>
            </td>
          </tr>
          <tr>
            <th className="font-semibold">EJG kód:</th>
            <td>
              <Input
                color={studentCode.length === 13 ? "primary" : "danger"}
                placeholder="EJG kód"
                value={studentCode}
                onChange={(e) => {
                  const code = e.target.value.toUpperCase();
                  setStudentCode(code);
                  if (!isValidEJGCode(code)) {
                    setStudentCodeError(
                      "Az EJG kód csak betűket és számokat tartalmazhat.",
                    );
                  } else {
                    setStudentCodeError("");
                  }
                }}
                isDisabled={!selfUser.tickets.includes("EJG_code_edit")}
              />
              {studentCodeError && (
                <p className="text-danger-600">{studentCodeError}</p>
              )}
            </td>
          </tr>
          <tr>
            <th className="font-semibold">OM azonosító 7. és 8. számjegye:</th>
            <td>
              <InputOtp
                length={2}
                value={code78OM}
                onValueChange={setCode78OM}
              />
            </td>
          </tr>
          <tr>
            <th className="font-semibold">
              Menza menü <strong>az oldalunkon</strong>:
            </th>
            <td>
              <RadioGroup
                value={!["A", "B"].includes(foodMenu) ? "?" : foodMenu}
                onChange={(e) => {
                  setFoodMenu(e.target.value);
                }}
                color="primary"
              >
                <Radio value="?">Mindkettő</Radio>
                <Radio value="A">A menü</Radio>
                <Radio value="B">B menü</Radio>
              </RadioGroup>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PersonalDataSettings;
