import "@/styles/bgimage.css";
import { siteConfig } from "@/config/site";
import {
  QuickTeachers,
  QuickTeachersDev,
} from "@/components/helyettesites/quickteacher";
import { Menu } from "@/components/menza/menu";
import { Section } from "@/components/home/section";
import { Events } from "@/components/events";
import { getAuth } from "@/db/dbreq";
// import Carousel from "@/components/home/carousel";
import Tray from "@/components/tray";
import LoginButton from "@/components/LoginButton";
import Footer from "@/components/footer";
import Elections from "@/components/events/elections";

export default async function Home() {
  const selfUser = await getAuth();
  return (
    <div>
      {(() => {
        return <Elections />;

        if (selfUser?.permissions.includes("user")) {
          // return <Carousel selfUser={selfUser} data={[]} />;
        } else if (selfUser === null) {
          return (
            <Tray>
              <h1 className="text-3xl font-bold text-selfprimary-900 md:text-4xl">
                Sajnáljuk, valamilyen hiba történt. Kérjük, próbáld újra később!
              </h1>
            </Tray>
          );
        } else {
          return (
            <Tray>
              <h1 className="text-3xl font-bold text-selfprimary-900 md:text-4xl">
                Hiányolsz valamit? Netán a híreket?
                <LoginButton />
              </h1>
            </Tray>
          );
        }
      })()}

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
        <Section
          title="Mi a mai menü?"
          dropdownable={true}
          defaultStatus={siteConfig.pageSections["menza"]}
        >
          <Menu
            menu={
              selfUser?.food_menu == "A" || selfUser?.food_menu == "B"
                ? selfUser?.food_menu
                : undefined
            }
          />
        </Section>
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
