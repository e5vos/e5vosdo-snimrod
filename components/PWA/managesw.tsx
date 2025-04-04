"use client";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

export const ServiceWorkerDetails = () => {
  const [showSWDetails, setShowSWDetails] = useState(false);
  const [subscription, setSubscription] = useState<any>();

  useEffect(() => {
    (async () => {
      const registration = await navigator.serviceWorker.ready;
      console.log("Service Worker is registered");
      const existingSubscription =
        await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={showSWDetails} onClose={() => setShowSWDetails(false)}>
      <ModalContent className="p-4">
        <ModalHeader>Service Worker részletek</ModalHeader>
        <p>{JSON.stringify(subscription)}</p>

        <Button
          onPress={() => {
            navigator.clipboard.writeText(JSON.stringify(subscription));
          }}
        >
          Másolás
        </Button>
      </ModalContent>
    </Modal>
  );
};

export const reinstallServiceWorker = async () => {
  const deleteServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker
        .getRegistrations()
        .then(async (registrations) => {
          for (let registration of registrations) {
            await registration.unregister().then((boolean) => {
              if (boolean) {
                console.log("Service worker unregistered");
              } else {
                console.log("Service worker could not be unregistered");
              }
            });
          }
        })
        .catch((error) => {
          console.error("Error getting service worker registrations:", error);
        });
    } else {
      console.log("Service workers are not supported in this browser");
    }
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(async (registration) => {
          console.log(
            "Service worker registered with scope:",
            registration.scope,
          );
          const response = await fetch("/api/subscribe", {
            method: "POST",
            body: JSON.stringify(registration),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Subscribe response:", response);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    } else {
      console.log("Service workers are not supported in this browser");
    }
  };

  await deleteServiceWorker();
  await registerServiceWorker();
  return "Service worker újratelepítve";
};

export const ReinstallServiceWorker = ({
  color,
  children,
}: {
  color?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary";
  children?: string;
}) => {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);

  const deleteServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker
        .getRegistrations()
        .then(async (registrations) => {
          for (let registration of registrations) {
            await registration.unregister().then((boolean) => {
              if (boolean) {
                console.log("Service worker unregistered");
              } else {
                console.log("Service worker could not be unregistered");
              }
            });
          }
          // location.reload();
        })
        .catch((error) => {
          console.error("Error getting service worker registrations:", error);
        });
    } else {
      console.log("Service workers are not supported in this browser");
    }
  };

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(async (registration) => {
          console.log(
            "Service worker registered with scope:",
            registration.scope,
          );
          const response = await fetch("/api/subscribe", {
            method: "POST",
            body: JSON.stringify(registration),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("Subscribe response:", response);
          setIsServiceWorkerRegistered(true);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    } else {
      console.log("Service workers are not supported in this browser");
    }
  };

  const checkServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length === 0) {
          console.log("Service worker not registered");
          setIsServiceWorkerRegistered(false);
          registerServiceWorker();
        } else {
          console.log("Service worker already registered");
          setIsServiceWorkerRegistered(true);
        }
      });
    } else {
      console.log("Service workers are not supported in this browser");
    }
  };

  useEffect(() => {
    checkServiceWorker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button
      color={color ?? (isServiceWorkerRegistered ? "success" : "danger")}
      onPress={async () => {
        await deleteServiceWorker();
        await registerServiceWorker();
        location.reload();
      }}
    >
      {children ?? "SW újratelepítése"}
    </Button>
  );
};

export const ManageSW = () => {
  return (
    <ButtonGroup>
      <ReinstallServiceWorker />
      <ServiceWorkerDetails />
    </ButtonGroup>
  );
};
