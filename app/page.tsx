import "@/styles/bgimage.css";
import { siteConfig } from "@/config/site";
import {
  QuickTeachers,
  QuickTeachersDev,
} from "@/components/helyettesites/quickteacher";
import { MenuInSection } from "@/components/menza/menu";
import { Section } from "@/components/home/section";
import { Events } from "@/components/events";
import { getAuth, UserType } from "@/db/dbreq";
import Tray from "@/components/tray";
import LoginButton from "@/components/LoginButton";
import Footer from "@/components/footer";
import Carousel from "@/components/home/carousel";
import { gate } from "@/db/permissions";
import HeadTimetable from "@/components/home/smartHead/headTimetable";
import { Chip } from "@heroui/react";
import FinalCountdown from "@/components/home/finalCountdown";
import { Alert } from "@/components/home/alert";
import PodcastDrop from "@/components/PodcastDrop";

const PageHeadContent = ({
  selfUser,
}: {
  selfUser: UserType | null | undefined;
}) => {
  if (selfUser?.permissions.includes("user"))
    return <Carousel data={[]} selfUser={selfUser} />;

  if (selfUser === null)
    return (
      <Tray>
        <h1 className="text-3xl font-bold text-selfprimary-900 md:text-4xl">
          Sajnáljuk, valamilyen hiba történt. Kérjük, próbáld újra később!
        </h1>
      </Tray>
    );

  return (
    <Tray>
      <h1 className="text-3xl font-bold text-selfprimary-900 md:text-4xl">
        Hiányolsz valamit? <br />
        Netán a híreket? <br />
        <span className="bg-gradient-to-r from-selfprimary-900 to-selfsecondary-300 bg-clip-text text-transparent">
          Vagy az órarendedet?
        </span>
        <LoginButton />
      </h1>
    </Tray>
  );
};

export default async function Home() {
  const selfUser = await getAuth();
  return (
    <div className="">
      <FinalCountdown date="2025-06-20T09:00:00Z" />

      {gate(selfUser, "user", "boolean") && (
        <Section
          title="Órarend"
          dropdownable={true}
          defaultStatus="closed"
          savable={true}
          chip={
            <Chip color="secondary" size="sm">
              Előnézet
            </Chip>
          }
        >
          <div className="max-w-md">
            <Alert
              icon={false}
              className="border-selfsecondary-300 bg-selfsecondary-100"
            >
              <a
                href="https://docs.google.com/spreadsheets/d/1097V-LMPhvk4vhOe8B_zUEp2Fpf7mtGs"
                className="text-selfsecondary-700"
              >
                Az aktuális teremcseréket itt találod. ➜
              </a>
            </Alert>
          </div>
          <HeadTimetable selfUser={selfUser} />
        </Section>
      )}

      {siteConfig.pageSections["helyettesitesek"] != "hidden" && (
        <Section
          title={"Helyettesítések"}
          dropdownable={true}
          defaultStatus={siteConfig.pageSections["helyettesitesek"]}
          newVersion={<QuickTeachersDev />}
          oldVersionName="Lista"
          newVersionName="Rács"
        >
          <QuickTeachers />
        </Section>
      )}

      {siteConfig.pageSections["menza"] != "hidden" && (
        <MenuInSection selfUser={selfUser} />
      )}

      {siteConfig.pageSections["esemenyek"] != "hidden" && (
        <Section
          title="Események"
          dropdownable={true}
          defaultStatus={siteConfig.pageSections["esemenyek"]}
        >
          <Events />
        </Section>
      )}

      <Section title="Keresel valamit?" dropdownable={false}>
        <Footer />
      </Section>

      <div className="hidden">
        {
          "Az oldal a Budapest V. Kerületi Eötvös József Gimnázium (más néven EJG) Diákönkormányzatának (más néven DÖ) tájékoztató oldala."
        }
      </div>
    </div>
  );
}
