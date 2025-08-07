"use client";
import SearchUser from "@/components/searchUser";
import Tray from "@/components/tray";
import { Parlament } from "@/db/parlament";
import { EJG_CLASSES } from "@/public/getUserClass";
import { Button, Link } from "@heroui/react";
import React, { useEffect, useState } from "react";

const MagicIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z" />
  </svg>
);

interface Props {
  parlamentId: number;
  initialParlament: Parlament;
  initialParticipants: Record<string, string[]>;
  usersNameByEmail: Record<string, string>;
}

const ParlamentIDClient = ({
  parlamentId,
  initialParlament,
  initialParticipants,
  usersNameByEmail,
}: Props) => {
  const [selectedUser, setSelectedUser] =
    useState<Record<string, string[]>>(initialParticipants);
  const [previousParlamentDelegates, setPreviousParlamentDelegates] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    // Fetch previous parlament participants for suggestions
    const fetchPreviousParticipants = async () => {
      try {
        const res = await fetch("/api/getParlaments", {
          headers: { module: "parlament" },
        });
        if (res.ok) {
          const data: Parlament[] = await res.json();
          const previousParlamentId = data
            ?.sort()
            .reverse()
            .find((p) => p.id < parlamentId)?.id;

          if (previousParlamentId) {
            const resp = await fetch("/api/getParlamentParticipants", {
              method: "POST",
              body: JSON.stringify({ parlamentId: previousParlamentId }),
              headers: {
                module: "parlament",
              },
            });
            if (resp.ok) {
              const previousData = await resp.json();
              setPreviousParlamentDelegates(previousData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching previous participants:", error);
      }
    };

    fetchPreviousParticipants();
  }, [parlamentId]);

  function deleteParlament(parlamentId: number) {
    fetch("/api/deleteParlament", {
      method: "POST",
      body: JSON.stringify({ parlamentId }),
      headers: {
        module: "parlament",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Parlament sikeresen törölve");
        window.location.href = "/parlament";
      } else {
        alert("Hiba a parlament törlése közben");
      }
    });
  }

  async function registerToParlament(email: string, group: string) {
    fetch("/api/registerToParlament", {
      method: "POST",
      body: JSON.stringify({
        email,
        group,
        parlamentId,
      }),
      headers: {
        module: "parlament",
      },
    }).then((res) => {
      if (res.ok) {
        setSelectedUser((prev) => ({
          ...prev,
          [group]: [...(selectedUser[group] ?? []), email],
        }));
      } else {
        alert("Hiba a regisztráció közben");
      }
    });
  }

  async function unregisterFromParlament(email: string, group: string) {
    try {
      const res = await fetch("/api/unregisterFromParlament", {
        method: "POST",
        body: JSON.stringify({
          email,
          group,
          parlamentId,
        }),
        headers: {
          module: "parlament",
        },
      });

      if (res.ok) {
        const updatedGroup = selectedUser[group].filter((e) => e !== email);
        setSelectedUser((prev) => ({
          ...prev,
          [group]: updatedGroup,
        }));
      } else {
        alert("Hiba a regisztráció törlésekor");
      }
    } catch (error) {
      console.error("Error unregistering from parlament:", error);
      alert("Hiba a regisztráció törlésekor");
    }
  }

  return (
    <Tray title={initialParlament.title} colorVariant="dark">
      <p>Időpont: {initialParlament.date}</p>
      <Link
        className="mt-2 rounded-md bg-selfsecondary-200 px-2 py-1 text-foreground"
        href="/parlament"
      >
        Vissza
      </Link>

      <div>
        {EJG_CLASSES.map((group) => (
          <div key={group} className="my-2 border-b-1 py-2">
            <div className="flex gap-2">
              <div
                className={
                  "text-xl font-extrabold " +
                  (!selectedUser[group]?.length ? "bg-danger-300" : "")
                }
              >
                {group}
              </div>
              <SearchUser
                addCustomParticipant={true}
                onSelectEmail={(email) => {
                  registerToParlament(email, group);
                }}
                usersNameByEmail={usersNameByEmail}
                label="Képviselő keresése"
                placeholder="Írj be egy résztvevőt..."
                size="sm"
              />
            </div>

            <div>
              {previousParlamentDelegates[group]?.length ? (
                <div>
                  {previousParlamentDelegates[group]
                    .filter((email) => !selectedUser[group]?.includes(email))
                    .map((email) => (
                      <Button
                        key={email}
                        color="default"
                        variant="faded"
                        onPress={() => registerToParlament(email, group)}
                      >
                        {MagicIcon} {email}
                      </Button>
                    ))}
                </div>
              ) : null}
            </div>

            <div>
              {selectedUser[group]?.length ? (
                <div>
                  {selectedUser[group].map((email) => (
                    <Button
                      key={email}
                      color="success"
                      onPress={() => unregisterFromParlament(email, group)}
                    >
                      {email}
                    </Button>
                  ))}
                </div>
              ) : (
                <p>Nincs hozzáadott képviselő</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        radius="sm"
        className="mt-2 bg-selfsecondary-200 px-1 text-foreground"
        onPress={() => deleteParlament(initialParlament.id)}
      >
        Parlament törlése
      </Button>
    </Tray>
  );
};

export default ParlamentIDClient;
